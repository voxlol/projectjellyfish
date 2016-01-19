FROM ruby:2.2.3
RUN apt-get update -qq && apt-get install -y build-essential libpq-dev
RUN curl -sL https://deb.nodesource.com/setup_4.x | bash -
RUN apt-get install -y nodejs

RUN mkdir /api
WORKDIR /api

ENV RACK_ENV=docker
ENV RAILS_ENV=docker
ENV DEVISE_SECRET_KEY=978e423d107dc2277f2987787a2f8ccd5ee0dcedf40f05f0188d732516a79559a7434feb56f35f31376f1b12325ac28ea540c8387fba83cb070e43af271ff9e9
ENV SECRET_KEY_BASE=c7a71de57183e6e8aefede7737332c6283ce85a061a779fd761eac14c011255b6fd151d8cb3dd7403404b0f248f01bf4cfb97a17ec72b9ff3c5d1bd1ca3d72b2
ENV DATABASE_URL=postgres://username:@localhost:5432/jellyfish

COPY Gemfile /api/
COPY Gemfile.lock /api/

COPY . /api/

RUN npm install -g gulp bower

RUN bundle install --without development test
RUN bower install --allow-root --config.interactive=false
RUN npm install --production
RUN gulp build

EXPOSE 3000

# Need to populate the DB

CMD bundle exec rails s -p 3000 -b '0.0.0.0'
