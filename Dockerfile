FROM ruby:2.2.1
RUN apt-get update -qq && apt-get install -y build-essential \
  make \
  libpq-dev \
  libqt4-webkit \
  libqt4-dev xvfb \
  nodejs
ENV APP_HOME /api
RUN mkdir $APP_HOME
WORKDIR $APP_HOME
ADD Gemfile* $APP_HOME/
ADD . $APP_HOME
RUN bundle install
