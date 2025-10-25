for i in {1,2,3,4,5,6,7}; do
	# curl "https://www.urloveinme.com/_api/blog-frontend-adapter-public/v2/post-feed-page?includeContent=false&languageCode=en&page=${i}&pageSize=50&type=ALL_POSTS" \
	curl "https://urlove.wixsite.com/_api/blog-frontend-adapter-public/v2/post-feed-page?includeContent=false&languageCode=en&page=${i}&pageSize=50&type=ALL_POSTS" \
	  -H 'x-wix-brand: wix' \
	  -H 'authorization: _-Y83k0NUsv6NbV3NELV5572fRZliHWuk5BozPx_aMQ.eyJpbnN0YW5jZUlkIjoiYzczNjI3ODktYjU5Ny00ODI3LThkMGQtM2M2Y2RiMzYxNmRhIiwiYXBwRGVmSWQiOiIyMmJlZjM0NS0zYzViLTRjMTgtYjc4Mi03NGQ0MDg1MTEyZmYiLCJtZXRhU2l0ZUlkIjoiYzczNjI3ODktYjU5Ny00ODI3LThkMGQtM2M2Y2RiMzYxNmRhIiwic2lnbkRhdGUiOiIyMDI1LTEwLTI1VDA2OjUxOjIyLjEyNloiLCJkZW1vTW9kZSI6ZmFsc2UsImFpZCI6IjAwZjdiNDRiLTA4M2ItNDVlYy04NGZhLTU3NmI0N2EwZmIwYiIsInNpdGVPd25lcklkIjoiNTU0NzJjNjItOTQ2Ni00ZThkLThjY2MtYTg0NGNmOTQ1Mjc5IiwiYnMiOiI0YVF2ZXY2bnEwcDBUbEJZcFJ0SVF3aXlfaVpQWUxrVFdFRFBnbVNLeVQwIiwic2NkIjoiMjAyMS0xMC0yNFQwMjo0ODozNS43NjBaIiwic3MiOmZhbHNlfQ' \
	  -H 'commonConfig: %7B%22brand%22%3A%22wix%22%2C%22host%22%3A%22VIEWER%22%2C%22BSI%22%3A%22fbdc6ab2-ddd8-4b5b-8ce0-e829ede14cc8%7C1%22%2C%22siteRevision%22%3A%22202%22%2C%22renderingFlow%22%3A%22NONE%22%2C%22language%22%3A%22zh%22%2C%22locale%22%3A%22en-sg%22%7D' \
	  -H 'Referer: https://www.urloveinme.com/_partials/wix-thunderbolt/dist/clientWorker.347e37a4.bundle.min.js' \
	  -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36' \
	  -H 'Accept: application/json, text/plain, */*' \
	  -H 'DNT: 1' > p${i}.json;
done

jq -s 'map(.postFeedPage.posts.posts) | add' p*.json > posts.json
