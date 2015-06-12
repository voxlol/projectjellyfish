# Step 8: Add Module Functionality

This is a continuation of [Jellyfish Module Setup](http://projectjellyfish.readthedocs.org/en/latest/Wiki/Modules/jellyfish_module_setup/) (Steps 1 through 7).

### Step 8: Add Module Functionality (Optional)

This section walks through how to create a client which can be used to persist to filesystem or database from a Jellyfish module.

It assumes that you have an empty module setup with the instructions [here](https://github.com/projectjellyfish/api/wiki/Jellyfish-Module-Setup).

##### Create Client

Add `lib/jellyfish_logger/client.rb` to module:

```ruby
require 'action_controller/log_subscriber'

module JellyfishLogger
  class Client < ActionController::LogSubscriber
    def process_action(event)
      extract_payload(event)
      log_payload
    end

    private

    def extract_payload(event)
      @payload = event.payload
      @controller = @payload[:controller]
      @action = @payload[:action]
      @params = @payload[:params]
      @format = @payload[:format]
      @method = @payload[:method]
      @path = @payload[:path]
    end

    def log_payload
      Rails.logger.info('Controller: ' + @controller)
      Rails.logger.info('Method: ' + @method)
      Rails.logger.info('Action: ' + @action)
      Rails.logger.info('Format: ' + @format.to_s)
      Rails.logger.info('Path: ' + @path)
      Rails.logger.info('Params: ' + @params.to_s)
    end
  end
end
```

Then add `config/initializers/default.rb`:
```
JellyfishLogger::Client.attach_to :action_controller
```
to attach the client to any controller in the parent app which extends ActionController.

See [here](http://rubyjunky.com/cleaning-up-rails-4-production-logging.html) for an excellent discussion on the different ways to extend the default Rails logger.

##### Persist to Filesystem

Add methods `prepare_content` and `write_to_file` to `lib/jellyfish_logger/client.db` and call them from the `process_action` callback:
```ruby
def process_action(event)
  extract_payload(event)
  log_payload
  prepare_content
  write_to_file if ENV['LOG_TO_FILE'] == 'true'
end

private

def write_to_file
  path = Rails.root.to_s + '/log/audit.txt'
  Rails.logger.info('START LOGGING TO: ' + path)
  File.open(path, 'a') do |f|
    f.puts(@content)
  end
  Rails.logger.info('END LOGGING TO: ' + path)
end

def prepare_content
  content = []
  content << 'Controller: ' + @controller
  content << 'Method: ' + @method
  content << 'Action: ' + @action
  content << 'Format: ' + @format.to_s
  content << 'Params: ' + @params.to_s
  @content = content.map { |ln| "#{ln}\n" }.join
end
```

Then add `spec/dummy/.env`:
```
LOG_TO_FILE = true
```
which turns on logging in the `spec/dummy` application. The `write_to_file` `path` can be set to anywhere write access is permitted. When deployed with Jellyfish, this module will output to `log/audit.txt` in the parent apps root dir.

##### Persist to Database

Create `event` model with rails:
```shell

# use rails generator
rails g model event --no-test-framework
      invoke  active_record
      create    db/migrate/20150507193348_create_jellyfish_logger_events.rb
      create    app/models/jellyfish_logger/event.rb
```

And modify `20150507193348_create_jellyfish_logger_events.rb` as follows:
```ruby
class CreateJellyfishLoggerEvents < ActiveRecord::Migration
  def change
    create_table :jellyfish_logger_events do |t|
      t.text :controller
      t.text :method
      t.text :action
      t.text :format
      t.text :path
      t.text :params
      t.timestamps null: false
    end
  end
end
```

Then run `event` migrations:
```shell
rake db:migrate
== 20150507193348 CreateJellyfishLoggerEvents: migrating =======================
-- create_table(:jellyfish_logger_events)
   -> 0.0108s
== 20150507193348 CreateJellyfishLoggerEvents: migrated (0.0109s) ==============
```
which also prepares the module's database for testing.

<table><tbody><tr><td>
To add migrations from a module to Jellyfish API, run the following <b>inside</b> Jellyfish API:<br>
<pre># copy migrations from jellyfish_logger module to jellyfish
rake jellyfish_logger:install:migrations
Copied migration 20150507193348_create_jellyfish_logger_events.jellyfish_logger.rb from jellyfish_logger

# add jellyfish_logger models to jellyfish schema
rake db:migrate
== 20150507193348 CreateJellyfishLoggerEvents: migrating =======================
-- create_table(:jellyfish_logger_events)
   -> 0.0108s
== 20150507193348 CreateJellyfishLoggerEvents: migrated (0.0109s) ==============</pre></td></tr></tbody></table>

Add method `write_to_db` to `lib/jellyfish_logger/client.db` and call it from the `process_action` callback:
```ruby
def process_action(event)
  extract_payload(event)
  log_payload
  write_to_db
end

private

def write_to_db
  event_params = { controller: @controller, method: @method, action: @action, format: @format, path: @path, params: @params }
  e = Event.new event_params
  e.save
end
```

Navigating to `spec/dummy` and running `rails s` should start adding records to the `jellyfish_audit_events` table:
![image](https://cloud.githubusercontent.com/assets/9356425/7540072/415de952-f571-11e4-8651-0e7ff1a94e19.png)

Here is an example controller spec to verify events are being persisted:
```ruby
require 'rails_helper'

module JellyfishLogger
  RSpec.describe 'Jellyfish Logger Spec', type: :request do
    it 'logs an event on the welcome controller', type: :request do
      get '/'
      expect(Event.last.controller).to eq('Rails::WelcomeController')
      expect(Event.last.method).to eq('GET')
      expect(Event.last.action).to eq('index')
      expect(Event.last.format).to eq('html')
      expect(Event.last.path).to eq('/')
      expect(Event.last.params).to eq('{"controller"=>"rails/welcome", "action"=>"index"}')
    end
  end
end
```