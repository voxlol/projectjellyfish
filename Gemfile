ruby '2.2.2'

source 'https://rubygems.org'

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '4.2.1'

# Use postgresql as the database for Active Record
gem 'pg', '~> 0.17.1'
gem 'pg_search', '~> 0.7.8'

# Pagination
gem 'will_paginate', '~> 3.0.7'

# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.0'

# bundle exec rake doc:rails generates the API under doc/api.
gem 'sdoc', '~> 0.4.0', group: :doc

# for console, rake
gem 'highline'

# .Env gem Gem
gem 'dotenv-rails'

# Use ActiveModel has_secure_password
gem 'bcrypt', '~> 3.1.7', require: 'bcrypt'

# Use puma as the app server
gem 'puma'

# Need the therubyracer
gem 'therubyracer'

# Use responders
gem 'responders'

# Authentication
gem 'devise'
gem 'ruby-saml', github: 'onelogin/ruby-saml'
gem 'omniauth'

# Authorization
gem 'pundit'

gem 'time_for_a_boolean'

gem 'custom_configuration'

gem 'bootstrap-sass'
gem 'sass-rails'
gem 'jellyfish_fog_aws'
gem 'jellyfish-manageiq'

# Autoprefixer for CSS classes using Can I Use values.
gem 'autoprefixer-rails'

# Tests
group :development, :test do
  gem 'annotate'
  gem 'awesome_print'
  gem 'brakeman', require: false
  gem 'codeclimate-test-reporter', require: nil
  gem 'database_cleaner', '~> 1.3.0'
  gem 'factory_girl_rails', '~> 4.0'
  gem 'license_finder'
  gem 'pry-rails'
  gem 'rspec-rails', '~> 3.0'
  gem 'rubocop'
  gem 'seed_dump'
  gem 'selenium-webdriver'
  gem 'poltergeist', require: 'capybara/poltergeist'
  gem 'spring'
  gem 'web-console', '~> 2.0.0'
  gem 'capybara-angular', '0.1.0'
  gem 'launchy'
end

group :test do
  gem 'rake' # for travis
  gem 'shoulda-matchers', require: false
end

# Documentation
gem 'apipie-rails', '~> 0.2.6'

# Keep but hide deleted records
gem 'paranoia'

# Communicating with external services
gem 'rest-client'
gem 'virtus'

# CORS
gem 'rack-cors'

# CRONTAB SCHEDULER
gem 'rufus-scheduler'

# ActiveRecord DelayedJob
gem 'delayed_job_active_record'

# Daemons for DelayedJob
gem 'daemons'

# Get picky about what is put into responses
gem 'active_model_serializers', '~> 0.8.0'

# Gems for Content Pages
gem 'friendly_id'
gem 'paper_trail'

gem 'sass'
gem 'uglifier'

group :production, :staging do
  gem 'rails_12factor'
end

# Add Tags
gem 'acts-as-taggable-on'

# Add Dependencies
source 'http://rails-assets.org' do
  gem 'rails-assets-angular', '>= 1.3.15'
  gem 'rails-assets-jquery'
  gem 'rails-assets-angucomplete-alt'
  gem 'rails-assets-angular-animate'
  gem 'rails-assets-angular-bootstrap'
  gem 'rails-assets-angular-cookies'
  gem 'rails-assets-angular-gravatar'
  gem 'rails-assets-angular-loading-bar'
  gem 'rails-assets-angular-progress-arc'
  gem 'rails-assets-angular-resource'
  gem 'rails-assets-angular-sanitize'
  gem 'rails-assets-angular-schema-form', '0.8.1'
  gem 'rails-assets-angular-smart-table'
  gem 'rails-assets-angular-ui-router'
  gem 'rails-assets-angular-ui-select'
  gem 'rails-assets-bootstrap-sass'
  gem 'rails-assets-lodash'
  gem 'rails-assets-ng-currency'
  gem 'rails-assets-microplugin'
  gem 'rails-assets-selectize'
  gem 'rails-assets-bootstrap'
  gem 'rails-assets-bootstrap3-datetimepicker'
  gem 'rails-assets-objectpath'
  gem 'rails-assets-tv4'
  gem 'rails-assets-angular-nvd3'
  gem 'rails-assets-ngDraggable'
  gem 'rails-assets-angular-filter'
  gem 'rails-assets-es5-shim'
end

# TO ENCODE DECIMALS AS JSON NUMBERS
gem 'activesupport-json_encoder'
