class Product
  class_attribute :registered_products
  self.registered_products = {}

  class << self
    def []=(key, product)
      fail(StandardError, "Product '%s' is already registered.".format(key)) if registered_products.key? key
      fail(StandardError, "Product class '%s' is already registered.".format(product.name)) if registered_products.key key
      registered_products[key] = product
    end

    def [](key)
      registered_products[key]
    end

    def all
      registered_products.values
    end
  end
end
