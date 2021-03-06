# Docker Installation

Guide to running API with Docker

## Installing Docker
Please see Docker's installation instructions available here: https://docs.docker.com/installation/

## Setup

The Dockerfile and docker-compose.yml are the two files that properly configure Jellyfish-API to run on Docker.  It is 
highly recommended that you change the secret keys in the docker-compose.yml file if you are running in production.  The
keys in the file are not secure.

Note: You should use the Docker container boozallen/projectjellyfish:latest

To begin running the newly created Docker image, check out the code from git.  Change into that directory, and then type the following:
```
docker-compose up
```
Then, in a different terminal, enter the following command to setup the database:
```
docker-compose run web rake db:setup
docker-compose run web rake db:seed
docker-compose run web rake sample:demo
```
Your application should now be running. To find your boot2docker ip address, run
```
boot2docker ip
```
The application will be running at that returned ip on port 3000
