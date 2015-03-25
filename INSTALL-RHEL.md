## How to install on Red Hat Enterprise Linux

This guide will walk you through how to install and run Jellyfish-API on Red Hat Enterprise Linux (or similar,
like CentOS).

#### Create jellyfish user

````
sudo useradd jellyfish
````

#### Install Pre-Requisites

````
yum install git
yum install gcc-c++ patch readline readline-devel zlib zlib-devel
yum install libyaml-devel libffi-devel openssl-devel make
yum install bzip2 autoconf automake libtool bison iconv-devel
yum install sqlite-devel
````

#### Install PostgreSQL

Please install PostgreSQL via PostgreSQL's directions on their website


#### Create the Jellyfish PostgreSQL database and user

You will need to be root to do this step.

Change to the postgres user
````
su - postgres
````

Connect to the database server
````
psql template1
````

Add the jellyfish database user (set your password to something very secure)
````
template1=# CREATE USER jellyfish WITH PASSWORD 'myPassword';
````

Create the database for jellyfish to use
````
template1=# CREATE DATABASE jellyfish_production;
````

Grant the jellyfish user access to the jellyfish_production database
````
template1=# GRANT ALL PRIVILEGES ON DATABASE jellyfish_production to jellyfish;
````

Exit out of the postgres user

#### Change to the jellyfish system users
````
su - jellyfish
````

#### Install rbenv

Install rbenv as per the [rbenv install guide](https://github.com/sstephenson/rbenv)

#### Install rbenv-build

Install rbenv-build as per the [rbenv-build install guide](https://github.com/sstephenson/rbenv-build)

#### Install Ruby, and set that as the global version

Please install the version of Ruby that is indicated in .ruby-version

````
rbenv install [version.number]
rbenv global [version.number]
````

#### Install bundler

````
gem install bundler
````

#### Install pg gem

````
gem install pg
```

#### Check out the latest code

````
cd /home/jellyfish
git clone https://github.com/projectjellyfish/api.git
````

#### Install any gems needed

````
cd /home/jellyfish/api
bundle install
````

#### Add this data to ./.env

You will need to create this file yourself (it is already in the .gitignore), the dotEnv gem uses this to to
"create" ENVIRONMENT variables.  Alternatively, you can simply create ENVIRONMENT vars yourself.

````
DATABASE_URL=postgres://jellyfish:myPassword@localhost:5432/jellyfish_production
CORS_ALLOW_ORIGIN=*
DEFAULT_URL=http://jellyfish-core-url.server.com
````

#### Populate the database

Run the following rake commands.  You only need to run "rake sample:demo" if
you are wanting, sample data (useful for development).  Please note that this
rake task does not create the database or the database user (those will need
to be created based on the DB you are using)

````
rake db:setup
rake db:seed
rake sample:demo
````

#### Start the server (for development)

````
rails s
````

##### Install Nginx

Please install PostgreSQL (the version that is stated in README.md) via 
PostgreSQL's documented process.

##### Configure Nginx

Delete the default site config
````
sudo rm /etc/nginx/conf.d/default.conf
````

Create jellyfish-api.conf (with the file contents below)
````
sudo vi /etc/nginx/conf.d/jellyfish-api.conf

# File (update the my_app_url.com) and

upstream myapp_puma {
  server unix:///tmp/myapp_puma.sock;
}

server {
  listen  80;
  root /home/jellyfish/api/public;

  location / {
        #all requests are sent to the UNIX socket
        proxy_pass http://myapp_puma;
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
````

Restart Nginx
````
sudo /etc/init.d/nginx restart
````

Start API
````
cd /home/jellyfish/api
bundle exec puma -e production -d -b unix:///tmp/myapp_puma.sock
````

####Upkeep Rake Tasks

The following rake commands need to be executed to maintain Jellyfish Core.

````
# Updates the budgets for projects
rake upkeep:update_budgets

# Pull down AWS pricing (not used at the moment)
rake upkeep:get_aws_od_pricing

# Get the status of VM's from ManageIQ
rake upkeep:poll_miq_vms

# Run the delayed job workers (this is what processes the orders to the various systems
rake jobs:work
````


Copyright 2015 Booz Allen Hamilton
