FROM ruby:2.2.2
RUN apt-get update -qq && apt-get install -y build-essential libpq-dev npm nodejs-legacy
RUN mkdir /api
WORKDIR /api

COPY Gemfile /api/
COPY Gemfile.lock /api/

RUN bundle install
COPY . /api/
