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

  def self.schemas
    names.map { |n| ProductType.new(n).schema }
  end

  def self.names
    all.keys
  end

  def schema
    all.to_h[name].merge(tags: tags)
  end

  def products
    Product.where(product_type: name)
  end

  def tags
    products.map(&:tag_list).flatten
  end

  def ==(other)
    other.name == name
  end

  def provisioner
    Rails.configuration.x.provisioners.fetch(name, NullProvisioner)
  end
end
