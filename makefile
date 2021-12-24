
DB_NAME := db-chat-bot
DB_PORT := 27017

all:
	docker run --rm -itd  \
		-v "$(shell pwd)/.volumes:/data/db"  \
		-p ${DB_PORT}:27017 \
		--name $(DB_NAME) \
		mongo 
clean:
	docker stop ${DB_NAME}