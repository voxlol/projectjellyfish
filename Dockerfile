FROM ubuntu

RUN apt-get update -qq && DEBIAN_FRONTEND=noninteractive apt-get -q -y install libpq-dev build-essential curl git zlib1g-dev libssl-dev libreadline-dev libyaml-dev libxml2-dev libxslt-dev libsqlite3-dev git-core wget

ENV DEVISE_SECRET_KEY="a8c987bb16a3943a8d63b01e225166bee20bf52a6d862be2a8bac7ef12a7ac0ffeac3285dd60f46efb75293dbdcdb21de4363b68c2651d7e4ddf118c142e3be8" \
    PORT="3000" \
    RAILS_ENV="production" \
    SECRET_KEY_BASE="$(openssl rand -base64 32)" \
    RUBY_VERSION="2.2.3" \
    CONFIGURE_OPTS="--disable-install-doc" \
    NODE_ENV="production" \
    NODE_VERSION="0.1.0" \
    PATH="/root/.rbenv/bin:/root/.rbenv/shims:$PATH"

RUN git clone https://github.com/sstephenson/rbenv.git ~/.rbenv \
    && git clone https://github.com/sstephenson/ruby-build.git ~/.rbenv/plugins/ruby-build \
    && ~/.rbenv/plugins/ruby-build/install.sh \
    && echo 'eval "$(rbenv init -)"' >> ~/.bashrc \
    && rbenv install $RUBY_VERSION \
    && rbenv global $RUBY_VERSION \
    && echo "gem: --no-ri --no-rdoc" > ~/.gemrc \
    && gem install bundler
RUN git clone https://github.com/tj/n.git ~/.n \
    && cd ~/.n \
    && make install \
    && n ${NODE_VERSION} \
    && rm -rf ~/.n
RUN mkdir -p /app
RUN npm install -g bower && npm install bower
RUN npm install -g gulp && npm install gulp
WORKDIR /app
COPY . /app
COPY Gemfile* /app/
RUN bundle install --without development test --jobs 4
COPY . /app/
RUN bundle exec rake assets:precompile
RUN rm -rf ./node_modules \
    && npm install --production
RUN echo '{ "allow_root": true }' > ~/.bowerrc \
    && bower install --config.interactive=false

EXPOSE 3000