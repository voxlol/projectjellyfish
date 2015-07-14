class Product
  include ActiveModel::Serialization
  include ActiveModel::SerializerSupport

  class_attribute :registered_products
  self.registered_products = {}

  def self.[]=(key, product)
    fail(StandardError, "Product '%s' is already registered.".format(key)) if registered_products.key? key
    fail(StandardError, "Product class '%s' is already registered.".format(product.name)) if registered_products.key key
    registered_products[key] = product
  end

  def self.[](key)
    registered_products[key]
  end

  def self.types
    registered_products.keys
  end

  def self.all
    registered_products.values
  end

  def name
    self.class.to_s.split('::').last.titlecase
  end

  def service_class
    Service
  end

  def listing_form
    []
  end

  def service_form
    []
  end

  def as_json(_)
    { name: name, listing_form: listing_form, service_form: service_form }
  end
end
