cd textures
echo 'myTextures=["'`ls -1tr *.jpg *.JPG|tr '\n' ','|sed -e 's/,/","/g'|sed -e 's/.jpg//g'|sed -e 's/.JPG//g'|sed -e 's/,\"$//'  `']' > files.js
echo 'myVideos=["'`ls -1tr *.mp4 |tr '\n' ','|sed -e 's/,/","/g'|sed -e 's/.mp4//g'|sed -e 's/.MP4//g'|sed -e 's/,\"$//'  `']' > videos.js
