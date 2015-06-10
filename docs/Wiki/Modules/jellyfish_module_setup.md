This guide explains how to create a module that can be used with [Project Jellyfish](https://github.com/projectjellyfish/api).
A continuation of this guide teaches you how to [Add Module Functionality](http://projectjellyfish.readthedocs.org/en/latest/Wiki/Modules/add_module_functionality/) (Step 8).

### Step 1: Create Empty Module

Modules in Jellyfish are implemented with gemified [Rails engines](http://guides.rubyonrails.org/engines.html).

To create a new module named `jellyfish_logger` run:

```shell
$ rails plugin new jellyfish_logger --dummy-path=spec/dummy --skip-test-unit --skip-bundle --mountable
```

Jellyfish uses [rspec](http://rspec.info/), so skip test-unit and auto bundle. See a good discussion of mountable engines [here](http://stackoverflow.com/questions/6118905/rails-3-1-engine-vs-mountable-app#answer-6833288).

### Step 2: Update Gemspec and Gemfile

##### Populate gemspec

Start by specifying a homepage, summary and description in Gemspec:
```shell
s.homepage    = "www.projectjellyfish.org"
s.summary     = "Jellyfish Logger Module "
s.description = "A module that adds log support to Jellyfish API"
```

Then replace MIT-LICENSE with APACHE [LICENSE](https://raw.githubusercontent.com/projectjellyfish/api/master/LICENSE) and switch README to `.md`:
```shell
s.license     = "APACHE"
s.files       = Dir["{app,config,db,lib}/**/*", "LICENSE", "Rakefile", "README.md"]
```

##### Add dependencies

Specify unversioned dependencies for rails and dotenv and replace sqlite3 with pg in Gemspec:
```shell
s.add_dependency "rails"
s.add_dependency "dotenv-rails" # to use env vars from jellyfish api
s.add_dependency 'pg' # to use jellyfish db
```

And add these dev and test dependencies to your Gemfile.
```shell
# DEV + TEST
group :development, :test do
  gem 'factory_girl_rails'
  gem 'database_cleaner'
  gem 'rspec-rails'
  gem 'capybara'
  gem 'rubocop'
  gem 'pry'
end
```
### Step 3: Setup Rakefile

Modify Rakefile to look like this:
```shell
begin
  require 'bundler/setup'
rescue LoadError
  puts 'You must `gem install bundler` and `bundle install` to run rake tasks'
end

APP_RAKEFILE = File.expand_path("../spec/dummy/Rakefile", __FILE__)
load 'rails/tasks/engine.rake'

Bundler::GemHelper.install_tasks

Dir[File.join(File.dirname(__FILE__), 'tasks/**/*.rake')].each {|f| load f }

require 'rspec/core'
require 'rspec/core/rake_task'
desc 'Run all specs in spec directory'
RSpec::Core::RakeTask.new(:spec)
task :default => :spec
```
The last block makes `rspec` executable via `rake`.

### Step 4: Setup Engine

Modify `lib/jellyfish_logger/engine.rb`  to autoload `lib` dir:
```ruby
module JellyfishLogger
  class Engine < ::Rails::Engine
    isolate_namespace JellyfishLogger
    config.autoload_paths += %W(#{config.root}/lib)
    config.generators do |g|
      g.test_framework :rspec
    end
  end
end
```
See [here](http://apidock.com/rails/Rails/Engine/isolate_namespace/class#1438-isolate-namespace-description-with-example) for why ```isolate_namespace``` is used.

### Step 5: Setup RSpec

##### Add Spec Helpers

Run `rails generate rspec:install` to add the following skeleton files:
- `.rspec`
- `spec/spec_helper.rb`
- `spec/rails_helper.rb`

Modify `.rspec` to run helpers before specs and format output:
```
--color
--format documentation
--require rails_helper
```

And update `spec/rails_helper.rb` to:
```ruby
ENV['RAILS_ENV'] ||= 'test'
require 'spec_helper'
require File.expand_path('../dummy/config/environment', __FILE__)
require 'rspec/rails'

# Loads Spec Support Files
Dir[Rails.root.join('../support/*.rb')].each { |f| require f }

# Checks for pending migrations before tests are run.
# If you are not using ActiveRecord, you can remove this line.
ActiveRecord::Migration.maintain_test_schema!

RSpec.configure do |config|
  # Remove this line if you're not using ActiveRecord or ActiveRecord fixtures
  config.fixture_path = "#{::Rails.root}/spec/fixtures"

  # If you're not using ActiveRecord, or you'd prefer not to run each of your
  # examples within a transaction, remove the following line or assign false
  # instead of true.
  config.use_transactional_fixtures = true

  # RSpec Rails can automatically mix in different behaviours to your tests
  # based on their file location, for example enabling you to call `get` and
  # `post` in specs under `spec/controllers`.
  #
  # You can disable this behaviour by removing the line below, and instead
  # explicitly tag your specs with their type, e.g.:
  #
  #     RSpec.describe UsersController, :type => :controller do
  #       # ...
  #     end
  #
  # The different available types are documented in the features, such as in
  # https://relishapp.com/rspec/rspec-rails/docs
  config.infer_spec_type_from_file_location!
end
```
This mounts `jellyfish_logger` on the test application in `spec/dummy`.

##### Setup Spec Database

Update `spec/dummy/config/database.yml` to use PostgreSQL:
```yaml
development: &default
  adapter: postgresql
  database: jellyfish_logger_development
  encoding: utf8
  host: localhost
  min_messages: warning
  pool: 2
  timeout: 5000

test:
  <<: *default
  database: jellyfish_logger_test

production:
  <<: *default
  database: jellyfish_logger_production
```

And add `spec/support/database_cleaner.rb` to clean up after tests:
```ruby
RSpec.configure do |config|
  config.before(:suite) do
    DatabaseCleaner.clean_with(:truncation)
  end

  config.before(:each) do
    DatabaseCleaner.strategy = :transaction
  end

  config.before(:each, type: :integration) do
    DatabaseCleaner.strategy = :truncation
  end

  config.before(:each, js: true) do
    DatabaseCleaner.strategy = :deletion
  end

  config.before(:each) do
    DatabaseCleaner.start
  end

  config.after(:each) do
    DatabaseCleaner.clean
  end
end
```
This is included by `Dir[Rails.root.join('../support/*.rb')].each { |f| require f }` in `spec/rails_helper.rb`.

##### Add Spec Routes

Include default Rails WelcomeController routes in `spec/dummy/config/routes.rb`:
```ruby
Rails.application.routes.draw do
  get '/rails/info/properties' => "rails/info#properties"
  get '/rails/info/routes'     => "rails/info#routes"
  get '/rails/info'            => "rails/info#index"
  get '/'                      => "rails/welcome#index"
  mount JellyfishLogger::Engine => "/jellyfish_logger"
end
```
They [are only loaded in development](http://stackoverflow.com/questions/17964830/where-is-the-default-welcome-aboard-page-located-in-my-app) and need to be available in test.

##### Setup Dotenv

By default, the `spec/dummy` application will not load Dotenv in test, so add the following lines to `spec/dummy/config/application.rb`:
```ruby
...
Bundler.require(*Rails.groups)
require "jellyfish_audit"

require "dotenv-rails"
Dotenv::Railtie.load

module Dummy
  class Application < Rails::Application
...
```

### Step 6: Verify Rake

First install gem dependencies:
```
$ bundle
```

Then create development and test databases for module:
```
$ rake db:create
```
These are required for specs and running the dummy application in the development.

And verify `rake` is setup:
```
$ rake
...
No examples found.

Finished in 0.00027 seconds (files took 1 second to load)
0 examples, 0 failures
```

### Step 7: Setup Git

##### Initialize Repo

Initialize git in your module:
```
git init
```

Replace `.gitignore` with the following:
```
# Ignore spec database.
spec/dummy/db

# Ignore log and tmp files.
log
tmp
spec/dummy/log
spec/dummy/tmp


# Ignore RubyMine files
.idea

# Ignore dotenv file
.env

# Ignore Gemfile lock
Gemfile.lock
```

Make your first commit:
```
git add .
git commit -m 'initial commit'
```

If you've created a repo on GitHub to host your module, then specify it as your origin:
```
git remote add origin https://github.com/projectjellyfish/jellyfish_logger.git
```

### Step 8: Add Functionality (Optional)

This section is optional, so you can directly proceed to Step 9 to load your module from Jellyfish API.

See [this](https://github.com/projectjellyfish/api/wiki/Add-Module-Functionality) page for instructions on how to add functionality to your module.

### Step 9: Load Module

You can load `jellyfish_logger` from Jellyfish API by specifying its path in the parent app's Gemfile:
```
gem 'jellyfish_logger', path: '../jellyfish_logger'
```

Alternatively, you can load your module in a parent app's Gemfile from GitHub as follows:
```
gem 'jellyfish_logger', git: 'git://github.com/projectjellyfish/jellyfish_logger.git
```

See [here](http://guides.rubygems.org/publishing) for instructions on how to make your module accessible from RubyGems.org - not required, but nice to have.