# Project Jellyfish RHEL Installation Guide

This guide will walk you through how to install and run Jellyfish on a fresh **Red Hat Enterprise Linux** (or similar, like CentOS) installation for a production environment.

## System Prep

##### Update System
Update your system (optional, but always a good idea).

```shell
sudo yum update
```

##### Create a Jellyfish User
It is a bad idea to run the application with root privileges.

```shell
sudo useradd jellyfish
```

##### Install Pre-Requisites

```shell
sudo yum install git
sudo yum install gcc-c++ patch readline readline-devel zlib zlib-devel
sudo yum install libyaml-devel libffi-devel openssl-devel make
sudo yum install bzip2 autoconf automake libtool bison iconv-devel
sudo yum install sqlite-devel libffi-devel openssl-devel
sudo yum install ntp
```

##### Install PostgreSQL Server

Please install PostgreSQL (9.4+) via [PostgreSQL's directions on their website](https://wiki.postgresql.org/wiki/YUM_Installation)

You will need to install all of the following packages

- `postgresql94-server`
- `postgresql94-devel`
- `postgresql94-contrib`

##### Start PostgreSQL Server and add as a service
```shell
sudo service postgresql-9.4 initdb
sudo service postgresql-9.4 start
sudo chkconfig postgresql-9.4 on
```

## Configure PostgreSQL Server
This section covers how to get PostgreSQL setup.

##### Change to the postgres user
```shell
sudo su - postgres
```

##### Connect to the database server
```shell
psql template1
```

##### Add the jellyfish database user
Replace `JELLYFISH_DB_PASSWORD` with a secure password before executing the following command.

_**template=#** is the prompt and is not part of the command._

```
template1=# CREATE USER jellyfish WITH PASSWORD 'JELLYFISH_DB_PASSWORD';
```

##### Grant SUPERUSER to jellyfish user
```
template1=# ALTER USER jellyfish WITH SUPERUSER;
```

##### Create the database for jellyfish to use
```
template1=# CREATE DATABASE jellyfish_production;
```

##### Grant the jellyfish user access to the jellyfish_production database
```
template1=# GRANT ALL PRIVILEGES ON DATABASE jellyfish_production to jellyfish;
```

##### Quit psql
```
\q
```

##### Exit out of the Postgres user
```
exit
```

##### Edit /var/lib/pgsql/9.4/data/pg_hba.conf
```
sudo vi /var/lib/pgsql/9.4/data/pg_hba.conf
```

Change the following (change '`ident`' to '`md5`'):

```
# IPv4 local connections:
host    all             all             127.0.0.1/32            ident
# IPv6 local connections:
host    all             all             ::1/128                 ident
```
to

```
# IPv4 local connections:
host    all             all             127.0.0.1/32            md5
# IPv6 local connections:
host    all             all             ::1/128                 md5
```

#### Restart PostgreSQL
```
sudo service postgresql-9.4 restart
```


#### Change to Jellyfish System Users
```
sudo su - jellyfish
```

#### Install rbenv
Install rbenv as per the [rbenv install guide](https://github.com/sstephenson/rbenv)

#### Install rbenv-build

Install ruby-build as per the [ruby-build install guide](https://github.com/sstephenson/ruby-build)

#### Check out Latest Code

```
cd /home/jellyfish
git clone https://github.com/projectjellyfish/api.git
```

#### Install Ruby
Please install the version of Ruby that is indicated in .ruby-version in the Jellyfish code, and set that as the global version

```
rbenv install "$(cat /home/jellyfish/api/.ruby-version)"
rbenv global "$(cat /home/jellyfish/api/.ruby-version)"
```

#### Install bundler
```
gem install bundler
```

#### Install pg gem
```
gem install pg -v '0.17.1' -- --with-pg-config=/usr/pgsql-9.4/bin/pg_config
```

##### Create Environment Variables
Setup the environment variables.  You can use either the .env.sample file OR use "real" environment variables.  It is _**highly**_ recommended that you use "real" environment variables in a production environment.

Before running the first command copy and edit it to replace `JELLYFISH_DB_PASSWORD` with the password you entered above for the jellyfish database user.

```
echo 'export DATABASE_URL=postgres://jellyfish:JELLYFISH_DB_PASSWORD@localhost:5432/jellyfish_production' >> ~/.bash_profile
echo 'export RAILS_ENV=test' >> ~/.bash_profile
```

## Build the Application

_**From this point on it is assumed you are executing commands within the api directory.**_

##### Ensure tools have been installed
```shell
npm install gulp-cli -g
npm install bower -g
```

##### Install dependencies
```shell
npm install
bundle install
```

##### Build the frontend
```shell
gulp build
```

##### Populate the Database
Run the following rake commands. Please note that this rake task does not create the database or the database user (those will need to be created based on the DB you are using)

```shell
rake db:migrate
rake db:seed
```

##### Seed with sample data (OPTIONAL)
You only need to run `rake sample:demo` if you are wanting sample data (useful for development).  

```shell
rake sample:demo
```

##### Start Server (Production)

```shell
rails s
```

##### Install Nginx
Please install Nginx via Nginx documented process.

##### Configure Nginx
Delete the default site config

```
sudo rm /etc/nginx/conf.d/default.conf
```

##### Create `jellyfish-api.conf`
```
sudo vi /etc/nginx/conf.d/jellyfish-api.conf
```

##### File contents for `jellyfish-api.conf`
Replace `JELLYFISH_URL` in the contents below before saving

```
upstream myapp_puma {
  server unix:///tmp/myapp_puma.sock;
}

server {
  listen  80;
  root /home/jellyfish/api/public;

  location / {
        #all requests are sent to the UNIX socket
        proxy_pass http://JELLYFISH_URL;
        proxy_redirect     off;

        proxy_set_header   Host             $host:$proxy_port;
        proxy_set_header   X-Real-IP        $remote_addr;
        proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;

        client_max_body_size       10m;
        client_body_buffer_size    128k;

        proxy_connect_timeout      90;
        proxy_send_timeout         90;
        proxy_read_timeout         90;

        proxy_buffer_size          4k;
        proxy_buffers              4 32k;
        proxy_busy_buffers_size    64k;
        proxy_temp_file_write_size 64k;
  }
}
```

##### Restart Nginx
```
sudo /etc/init.d/nginx restart
```

##### Start API
```
cd /home/jellyfish/api
bundle exec puma -e production -d -b unix:///tmp/myapp_puma.sock
```

#### Upkeep Rake Tasks
The following rake commands need to be executed to maintain Jellyfish Core.

```
# Updates the budgets for projects
rake upkeep:update_budgets

# Pull down AWS pricing (not used at the moment)
rake upkeep:get_aws_od_pricing

# Get the status of VM's from ManageIQ
rake upkeep:poll_miq_vms

# Run the delayed job workers (this is what processes the orders to the various systems
rake jobs:work
```


Copyright 2015 Booz Allen Hamilton
