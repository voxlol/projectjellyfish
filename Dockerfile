FROM ruby:2.2.1
RUN apt-get update -qq && apt-get install -y build-essential
RUN apt-get install make
RUN apt-get update -qq && apt-get install -y build-essential libpq-dev
RUN apt-get install -y libqt4-webkit libqt4-dev xvfb
RUN apt-get install -y nodejs
ENV APP_HOME /api
RUN mkdir $APP_HOME
WORKDIR $APP_HOME
ADD Gemfile* $APP_HOME/
RUN bundle install
ADD . $APP_HOME