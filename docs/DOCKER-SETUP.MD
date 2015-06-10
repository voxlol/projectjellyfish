# Getting API Running with Docker (on OSX)

Guide to running API with Docker

## Installing Docker
Please see Docker's installation instructions available here: https://docs.docker.com/installation/mac/

## Setup
The Dockerfile and docker-compose.yml are the two files that properly configure Jellyfish-API to run on Docker. These files do not need to be altered. In your .env file, remove the following references to avoid database conflicts:
```
DATABASE_URL=
CORS_ALLOW_ORIGIN=
DEFAULT_URL=
```
You will need to set your devise secret key as an environment variable.

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
docker-compose run web rake db:create
docker-compose run web rake db:migrate
docker-compose run web rake sample:demo
```
Your application should now be running. To find your boot2docker ip address, run
```
boot2docker ip
```
The application will be running at that returned ip on port 3000
