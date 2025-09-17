import { readFileSync, mkdirSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import TurndownService from 'turndown';

const turndown = new TurndownService();

// Read posts.json
let posts = JSON.parse(readFileSync('posts.json', 'utf8'));

// Ensure output directory exists
const outputDir = 'content/posts';
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

const patchPostMarkdown = (post) => {
  let md = readFileSync(join(outputDir, post.slug, 'index.md'), 'utf8');

  // replace the "date: ..." line data with post.firstPublishedDate
  md = md.replace(/date: .*\n/, `date: ${post.firstPublishedDate || new Date().toISOString()}\n`);

  // something else...
  // e.g. update webp images
  md = md.replace(/https:\/\/static\.wixstatic\.com\/media\/[a-zA-Z0-9_~]+\.(png|jpg|webp)/g, (match) => {
    const cleanUrl = match.match(/https:\/\/static\.wixstatic\.com\/media\/[a-zA-Z0-9_~]+\.(png|jpg|webp)/);
    return cleanUrl ? cleanUrl[0] : match;
  });

  // finally write back
  writeFileSync(join(outputDir, post.slug, 'index.md'), md);
}

async function processSinglePost(post) {
  try {
    const slug = post.slug;
    const folderPath = join(outputDir, slug);
    
    // Create folder if it doesn't exist
    if (!existsSync(folderPath)) {
      mkdirSync(folderPath, { recursive: true });
    }

    if (existsSync(join(folderPath, 'index.md'))) {
      console.log(`Post ${slug} already exists. Patching...`);
      patchPostMarkdown(post);
      return post;
    }

    let imageExt = 'jpg'; // Default extension
    const imageUrl = post?.media?.wixMedia?.image?.url
    if (imageUrl) {
      imageExt = imageUrl.split('.').pop().split('?')[0];
      const imagePath = join(folderPath, `image.${imageExt}`);
      
      try {
        const response = await fetch(imageUrl);
        const imageBlob = await response.blob();
        await Bun.write(imagePath, imageBlob);
      } catch (err) {
        console.error(`Error downloading image for ${slug}:`, err.message);
        imageExt = 'jpg'; // Fallback to default
      }
    }

    let markdownContent = '# No content available.\n\n'; // Default fallback

    // Fetch and parse HTML content from link
    if (post.link) {
      try {
        const response = await fetch(post.link);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const html = await response.text();
        const contentMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/) || html.match(/<div class="content"[^>]*>([\s\S]*?)<\/div>/);
        const rawContent = contentMatch ? contentMatch[1] : html;
        markdownContent = turndown.remove("header").turndown(rawContent);

        // replace
        // https://static.wixstatic.com/media/55472c_2143a555b3bc420d9f02c2165fda8a5c~mv2.png/v1/fill/w_78,h_60,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/%E6%88%AA%E5%B1%8F2021-10-27%20%E4%B8%8B%E5%8D%881_33_44.png%201x,%20https://static.wixstatic.com/media/55472c_2143a555b3bc420d9f02c2165fda8a5c~mv2.png/v1/fill/w_156,h_120,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/%E6%88%AA%E5%B1%8F2021-10-27%20%E4%B8%8B%E5%8D%881_33_44.png%202x%22%20id=%22img_comp-kvazuqnr1%22%20src=%22https://static.wixstatic.com/media/55472c_2143a555b3bc420d9f02c2165fda8a5c~mv2.png/v1/fill/w_78,h_60,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/%E6%88%AA%E5%B1%8F2021-10-27%20%E4%B8%8B%E5%8D%881_33_44.png
        // into just
        // https://static.wixstatic.com/media/55472c_2143a555b3bc420d9f02c2165fda8a5c~mv2.png
        // removing all the parameters after ~mv2.{png,jpg,webp}
        const urlRegex = /https:\/\/static\.wixstatic\.com\/media\/[a-zA-Z0-9_~]+\.(png|jpg|webp)/g;
        markdownContent = markdownContent.replace(/https:\/\/static\.wixstatic\.com\/media\/[a-zA-Z0-9_~]+\.[^\s)"]*/g, (match) => {
          const cleanUrl = match.match(urlRegex);
          return cleanUrl ? cleanUrl[0] : match;
        });
      } catch (err) {
        console.error(`Error fetching content for ${slug}:`, err.message);
      }
    }

    // Create frontmatter
    const frontmatter = `---
title: "${post.title}"
date: ${post.firstPublishedDate || new Date().toISOString()}
author: ${post.author || 'Ida Gao'}
cover: image.${imageExt}
images:
  - image.${imageExt}
categories:
  - ${post.categories ? post.categories.join('\n  - ') : 'Uncategorized'}
---

${markdownContent.replace('\n\n', '\n\n<!--more-->\n\n')}
`;

    // Write index.md
    writeFileSync(join(folderPath, 'index.md'), frontmatter);
    console.log(`Processed single post: ${slug}`);
    
    // Update the original post in the array
    const index = posts.findIndex(p => p.slug === slug);
    if (index !== -1) {
      posts[index] = post;
    }
    
    return post;
  } catch (err) {
    console.error(`Error processing single post ${post.slug}:`, err.message);
    return post;
  }
}

async function processAllPosts() {
  for (let post of posts) {
    await processSinglePost(post);
  }
}

// Check if a slug argument is provided
const args = process.argv.slice(2);
if (args.length > 0) {
  const slug = args[0];
  const post = posts.find(p => p.slug === slug);
  if (post) {
    await processSinglePost(post);
    console.log(`Single post ${slug} processed!`);
  } else {
    console.error(`Post with slug '${slug}' not found.`);
  }
} else {
  await processAllPosts();
}
