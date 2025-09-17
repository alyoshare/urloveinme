for i in {1,2,3,4,5,6}; do
	curl "https://www.urloveinme.com/_api/blog-frontend-adapter-public/v2/post-feed-page?includeContent=false&languageCode=en&page=${i}&pageSize=50&type=ALL_POSTS" \
	  -H 'x-wix-brand: wix' \
	  -H 'authorization: aN4p6b-4KvsaOZyqjJ6YFRZ8wn1dL1cZQ1mufj7n7hk.eyJpbnN0YW5jZUlkIjoiYzczNjI3ODktYjU5Ny00ODI3LThkMGQtM2M2Y2RiMzYxNmRhIiwiYXBwRGVmSWQiOiIyMmJlZjM0NS0zYzViLTRjMTgtYjc4Mi03NGQ0MDg1MTEyZmYiLCJtZXRhU2l0ZUlkIjoiYzczNjI3ODktYjU5Ny00ODI3LThkMGQtM2M2Y2RiMzYxNmRhIiwic2lnbkRhdGUiOiIyMDI1LTA5LTE3VDA4OjMxOjE1LjI1MFoiLCJkZW1vTW9kZSI6ZmFsc2UsImFpZCI6IjAwNTRjMmFkLWU4MDEtNDE2Zi1hOWVjLTQ2NTUxZDRjMzEzOSIsInNpdGVPd25lcklkIjoiNTU0NzJjNjItOTQ2Ni00ZThkLThjY2MtYTg0NGNmOTQ1Mjc5IiwiYnMiOiJNdHVUcTZvMnRtMF9NdDJMZU1fQmNiNUNHRy16VXZMQU96R3NtWDRJVzhvIiwic2NkIjoiMjAyMS0xMC0yNFQwMjo0ODozNS43NjBaIiwic3MiOmZhbHNlfQ' \
	  -H 'commonConfig: %7B%22brand%22%3A%22wix%22%2C%22host%22%3A%22VIEWER%22%2C%22BSI%22%3A%22acbeca54-cf33-42c5-821c-c646368b318f%7C1%22%2C%22siteRevision%22%3A%22193%22%2C%22renderingFlow%22%3A%22NONE%22%2C%22language%22%3A%22en%22%2C%22locale%22%3A%22en-sg%22%7D' \
	  -H 'Referer: https://www.urloveinme.com/_partials/wix-thunderbolt/dist/clientWorker.347e37a4.bundle.min.js' \
	  -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36' \
	  -H 'Accept: application/json, text/plain, */*' \
	  -H 'DNT: 1' > p${i}.json;
done

jq -s 'map(.postFeedPage.posts.posts) | add' p*.json > posts.json
