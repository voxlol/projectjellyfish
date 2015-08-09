begin
  if Setting.table_exists?
    Dir[Rails.root.join 'app', 'models', 'setting', '*.rb'].each do |setting_model|
      require_dependency setting_model
    end
    Setting.descendants.each(&:load_defaults)
  end
rescue
  false
end

begin
  if ProductType.table_exists?
    Dir[Rails.root.join 'app', 'models', 'product_type', '*.rb'].each do |product_type_model|
      require_dependency product_type_model
    end
    ProductType.descendants.each(&:load_product_types)
  end
rescue
  false
end

begin
  if RegisteredProvider.table_exists?
    Dir[Rails.root.join 'app', 'models', 'registered_provider', '*.rb'].each do |registered_provider_model|
      require_dependency registered_provider_model
    end
    RegisteredProvider.descendants.each(&:load_registered_providers)
  end
rescue
  false
end


# Include demo support code in development
if Rails.env.development?
  Dir[Rails.root.join 'app', 'models', 'null', '*.rb'].each do |null_model|
    require_dependency null_model
  end

  require 'jellyfish/demo'
end
