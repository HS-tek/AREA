#!/usr/bin/env bash
# docker build -t auth0-javascript-sample-01-login .
# docker run --init -p 8080:8080 -it auth0-javascript-sample-01-login
docker-compose down
docker-compose build && docker-compose up