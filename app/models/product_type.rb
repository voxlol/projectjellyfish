require 'null_provisioner'

class ProductType
  attr_reader :name, :description

  delegate :all, to: self

  def initialize(name)
    @name = name
  end

  def self.all
    Rails.configuration.x.product_types
  end

  def self.names
    all.keys
  end

  def schema
    all.to_h[name]
  end

  def products
    Product.where(product_type: name)
  end

  def ==(other)
    other.name == name
  end

  def provisioner
    Rails.configuration.x.provisioners.fetch(name, NullProvisioner)
  end
end
