FROM ubuntu

RUN apt-get update -qq && DEBIAN_FRONTEND=noninteractive apt-get -q -y install git-core build-essential wget libssl-dev curl git zlib1g-dev libreadline-dev libyaml-dev libxml2-dev libxslt-dev libsqlite3-dev libpq-dev

ENV PORT="3000" \
    DEVISE_SECRET_KEY="79b2aa444ce12b995c83f19654b057de80c8cd57194a8398efdb3dd8b0ec1ae9688a28c9ca858ad155b229cabcd90612c5f8e2b42b6893a795407afc7a37b0f7" \
    RAILS_ENV="production" \
    SECRET_KEY_BASE="$(openssl rand -base64 32)" \
    NODE_ENV="production" \
    NODE_VERSION="5.x" \
    RUBY_VERSION="2.3.5" \
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
RUN npm install -g gulp && npm install gulp
RUN npm install -g bower && npm install bower
WORKDIR /app
COPY . /app
COPY Gemfile* /app/
RUN bundle install --without development test --jobs 4
COPY . /app/
RUN bundle exec rake assets:precompile
RUN echo '{ "allow_root": true }' > ~/.bowerrc \
    && bower install --config.interactive=false
RUN rm -rf ./node_modules \
    && npm install --production

EXPOSE 3000