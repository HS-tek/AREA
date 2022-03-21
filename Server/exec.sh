#!/bin/bash
docker-compose stop
sudo chmod -R 755 ./data
docker-compose build
docker-compose up