init_settings = begin
  Setting.table_exists?
rescue
  false
end

if init_settings
  Dir[Rails.root.join 'app', 'models', 'setting', '*.rb'].each do |setting_model|
    require_dependency setting_model
  end

  Setting.descendants.each(&:load_defaults)
end

# Include demo support code in development
if Rails.env.development?
  Dir[Rails.root.join 'app', 'models', 'null', '*.rb'].each do |setting_model|
    require_dependency setting_model
  end

  require 'jellyfish/demo'
end
