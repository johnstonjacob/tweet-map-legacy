docker stop tweetmap && docker rm tweetmap && docker build -t tweetmap . && docker run --name tweetmap -p 8686:8080 -d tweetmap 
