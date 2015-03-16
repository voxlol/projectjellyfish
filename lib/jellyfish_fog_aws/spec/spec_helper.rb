ENV['RAILS_ENV'] = 'test'
require File.expand_path('../dummy/config/environment', __FILE__)
require 'rspec/rails'
require 'shoulda/matchers'
require 'factory_girl'
require 'database_cleaner'
require 'bcrypt'
Dir[Rails.root.join('spec/support/**/*.rb')].each { |f| require f }

RSpec.configure do |config|
  config.expect_with :rspec do |expectations|
    expectations.include_chain_clauses_in_custom_matcher_descriptions = true
  end

  config.mock_with :rspec do |mocks|
    mocks.verify_partial_doubles = true
  end

  config.order = :random
  config.use_transactional_fixtures = false
  config.infer_spec_type_from_file_location!
end
