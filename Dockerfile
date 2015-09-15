FROM ruby:2.2.2
RUN apt-get update -qq && apt-get install -y build-essential libpq-dev npm nodejs-legacy
RUN mkdir /api
WORKDIR /api

RUN npm install -g gulp bower

COPY Gemfile /api/
COPY Gemfile.lock /api/

RUN bundle install
COPY . /api/

RUN bower install --allow-root --config.interactive=false
RUN npm install
RUN gulp build
