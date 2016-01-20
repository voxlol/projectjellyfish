# Docker Installation

Guide to running API with Docker

## Installing Docker
Please see Docker's installation instructions available here: https://docs.docker.com/installation/

## Setup
The Dockerfile and docker-compose.yml are the two files that properly configure Jellyfish-API to run on Docker.  It is 
highly recommended that you change the secret keys in the docker-compose.yml file if you are running in production.  The
keys in the file are not secure.

In a terminal inside of your project directory, run the following command to build the image:
```
docker-compose build
```
To begin running the newly created Docker image, run
```
docker-compose up
```
In a different terminal, enter the following command to setup the database
```
docker-compose run web rake db:migrate && rake db:seed && rake sample:demo
```
Your application should now be running. To find your boot2docker ip address, run
```
boot2docker ip
```
The application will be running at that returned ip on port 3000
