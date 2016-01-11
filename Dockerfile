FROM ruby:2.2.3
RUN apt-get update -qq && apt-get install -y build-essential libpq-dev
RUN curl -sL https://deb.nodesource.com/setup_4.x | bash -
RUN apt-get install -y nodejs

RUN mkdir /api
WORKDIR /api

RUN npm install -g gulp bower

COPY Gemfile /api/
COPY Gemfile.lock /api/

RUN bundle install --without development test
COPY . /api/

RUN bower install --allow-root --config.interactive=false
RUN npm install --production
RUN gulp build
