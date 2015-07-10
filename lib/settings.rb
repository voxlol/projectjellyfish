require 'yaml'
require_relative 'jellyfish/version'

settings_file = ["settings.#{Rails.env}.yml", 'settings.yml'].find do |file|
  File.exist? File.join Rails.root, 'config', file
end

if settings_file
  SETTINGS = YAML.load_file(File.join Rails.root, 'config', settings_file)
  SETTINGS[:version] = Jellyfish::Version.new

  # Load plugin config, if any
  Dir[File.join Rails.root, 'config', 'settings.d', '*.yml'].each do |f|
    SETTINGS.merge! YAML.load_file f
  end
else
  SETTINGS = []
end

