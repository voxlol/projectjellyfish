## How to install on Red Hat Enterprise Linux

This guide will walk you through how to install and run Jellyfish on a fresh Red Hat Enterprise Linux (or similar,
like CentOS) installation for a production environment.

#### Update system

Update your system (optional, but always a good idea)

```
sudo yum update
```

#### Create jellyfish user

````
sudo useradd jellyfish
````

#### Install Pre-Requisites

````
sudo yum install git
sudo yum install gcc-c++ patch readline readline-devel zlib zlib-devel
sudo yum install libyaml-devel libffi-devel openssl-devel make
sudo yum install bzip2 autoconf automake libtool bison iconv-devel
sudo yum install sqlite-devel libffi-devel openssl-devel
sudo yum install ntp
````

#### Install PostgreSQL server

Please install PostgreSQL (9.4+) via [PostgreSQL's directions on their website](https://wiki.postgresql.org/wiki/YUM_Installation)

Note: You will need to install postgresql-server and postgresql-devel and postgresql94-contrib

#### Start the PostgreSQL server, and start on boot

````
sudo service postgresql-9.4 initdb
sudo service postgresql-9.4 start
sudo chkconfig postgresql-9.4 on
````

#### Configure PostgreSQL server

This section covers how to get PostgreSQL setup.

##### Change to the postgres user
````
sudo su - postgres
````

##### Connect to the database server
````
psql template1
````

##### Add the jellyfish database user (set your password to something very secure)
````
template1=# CREATE USER jellyfish WITH PASSWORD 'myPassword';
````

##### Grant SUPERUSER to jellyfish user

````
template1=# ALTER USER myuser WITH SUPERUSER;
````

##### Create the database for jellyfish to use
````
template1=# CREATE DATABASE jellyfish_production;
````

##### Grant the jellyfish user access to the jellyfish_production database

````
template1=# GRANT ALL PRIVILEGES ON DATABASE jellyfish_production to jellyfish;
````

##### Exit out of the Postgres user

````
exit
````

##### Edit /var/lib/pgsql/9.4/data/pg_hba.conf

Change the following (change 'ident' to 'md5'):

````
# IPv4 local connections:
host    all             all             127.0.0.1/32            ident
# IPv6 local connections:
host    all             all             ::1/128                 ident
````
to
````
# IPv4 local connections:
host    all             all             127.0.0.1/32            md5
# IPv6 local connections:
host    all             all             ::1/128                 md5
````

#### Restart PostgreSQL
````
sudo service postgresql-9.4 restart
````


#### Change to the jellyfish system users
````
sudo su - jellyfish
````

#### Install rbenv

Install rbenv as per the [rbenv install guide](https://github.com/sstephenson/rbenv)

#### Install rbenv-build

Install rbenv-build as per the [rbenv-build install guide](https://github.com/sstephenson/rbenv-build)

#### Check out the latest code

````
cd /home/jellyfish
git clone https://github.com/projectjellyfish/api.git
````

#### Install Ruby, and set that as the global version

Please install the version of Ruby that is indicated in .ruby-version in the Jellyfish code

````
rbenv install "$(cat /home/jellyfish/api/.ruby-version)"
rbenv global "$(cat /home/jellyfish/api/.ruby-version)"
````

#### Install bundler

````
gem install bundler
````

#### Install pg gem

````
gem install pg -v '0.17.1' -- --with-pg-config=/usr/pgsql-9.4/bin/pg_config
```

#### Install any gems needed

````
cd /home/jellyfish/api
bundle install --without development:test
````

#### Create Enviroment Variables

Setup the environment variables

````
echo 'export DATABASE_URL=postgres://jellyfish:myPassword@localhost:5432/jellyfish_production' >> ~/.bash_profile
echo 'export export RAILS_ENV=test' >> ~/.bash_profile
````

#### Populate the database

Run the following rake commands.  You only need to run "rake sample:demo" if
you are wanting, sample data (useful for development).  Please note that this
rake task does not create the database or the database user (those will need
to be created based on the DB you are using)

````
rake db:migrate
rake db:seed
rake sample:demo
````

#### Start the server (for production)

````
rails s
````

##### Install Nginx

Please install Nginx via Nginx documented process.

##### Configure Nginx

Delete the default site config

````
sudo rm /etc/nginx/conf.d/default.conf
````

Create jellyfish-api.conf (with the file contents below)
````
sudo vi /etc/nginx/conf.d/jellyfish-api.conf
````


##### File (update the my_app_url.com)
````
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
