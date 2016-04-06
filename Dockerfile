FROM ubuntu

RUN apt-get update -qq && DEBIAN_FRONTEND=noninteractive apt-get -q -y install libpq-dev build-essential git-core wget libssl-dev curl git zlib1g-dev libreadline-dev libyaml-dev libxml2-dev libxslt-dev libsqlite3-dev

ENV PORT="3000" \
    DEVISE_SECRET_KEY="1442b3a4b4ccfd790b9c445f215c75fa2a8d1ac80248fec56c9dd662f2936fce4e08ac6ad46b80004baa0f48ec8fe19f047376ce334cf90cb6a258ed4f3c85bf" \
    RAILS_ENV="production" \
    SECRET_KEY_BASE="$(openssl rand -base64 32)" \
    NODE_ENV="production" \
    NODE_VERSION="5.x" \
    RUBY_VERSION="2.3.2" \
    CONFIGURE_OPTS="--disable-install-doc" \
    PATH="/root/.rbenv/bin:/root/.rbenv/shims:$PATH"

RUN git clone https://github.com/tj/n.git ~/.n \
    && cd ~/.n \
    && make install \
    && n ${NODE_VERSION} \
    && rm -rf ~/.n
RUN git clone https://github.com/sstephenson/rbenv.git ~/.rbenv \
    && git clone https://github.com/sstephenson/ruby-build.git ~/.rbenv/plugins/ruby-build \
    && ~/.rbenv/plugins/ruby-build/install.sh \
    && echo 'eval "$(rbenv init -)"' >> ~/.bashrc \
    && rbenv install $RUBY_VERSION \
    && rbenv global $RUBY_VERSION \
    && echo "gem: --no-ri --no-rdoc" > ~/.gemrc \
    && gem install bundler
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