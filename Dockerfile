FROM ruby:2.2.2
RUN apt-get update -qq && apt-get install -y build-essential libpq-dev
RUN mkdir /api
WORKDIR /api
#ADD Gemfile /api/Gemfile

ADD . /api
RUN bundle install
