require 'yaml'
require_relative 'jellyfish/version'

settings_file = ["settings.#{Rails.env}.yml", 'settings.yml'].find do |file|
  File.exist? File.join Rails.root, 'config', file
end

if settings_file
  SETTINGS = YAML.load_file("#{root}/#{settings_file}")
  SETTINGS[:version] = Jellyfish::Version.new
  SETTINGS[:unattended] = SETTINGS[:unattended].nil? || SETTINGS[:unattended]
  SETTINGS[:login] ||= SETTINGS[:ldap]

# Load plugin config, if any
  Dir["#{root}/config/settings.plugins.d/*.yml"].each do |f|
    SETTINGS.merge! YAML.load_file f
  end
else
  SETTINGS = []
end

