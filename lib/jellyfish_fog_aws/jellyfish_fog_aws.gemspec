$LOAD_PATH.push File.expand_path('../lib', __FILE__)

require 'jellyfish_fog_aws/version'

Gem::Specification.new do |s|
  s.name = 'jellyfish_fog_aws'
  s.version = Jellyfish::Fog::AWS::VERSION
  s.authors = ['Caleb Thompson']
  s.email = ['caleb@calebthompson.io']
  s.homepage = 'https://github.com/projectjellyfish/api'
  s.summary = 'Fog AWS module for Jellyfish Core'
  s.description = 'Manage AWS products through Fog on Jellyfish Core API'
  s.license = 'MIT'
  s.require_paths = ['lib']

  s.files = `git ls-files -z`.split("\x0")

  s.add_dependency 'rails'
  s.add_dependency 'fog'
  s.add_dependency 'bcrypt'

  s.add_development_dependency 'pg'
  s.add_development_dependency 'rspec-rails'
  s.add_development_dependency 'shoulda-matchers'
  s.add_development_dependency 'factory_girl_rails'
  s.add_development_dependency 'database_cleaner'
  s.add_development_dependency 'pry-rails'
end
