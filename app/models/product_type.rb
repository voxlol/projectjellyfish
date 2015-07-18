class ProductType
  include Virtus.model
  include ActiveModel::Validations
  include ActiveModel::Serialization
  include ActiveModel::SerializerSupport

  attribute :uuid, String
  attribute :name, String
  attribute :description, String
  attribute :service_class, String
  attribute :listing_form, Hash, default: -> (_, _) { { main: [] } }
  attribute :service_form, Hash, default: -> (_, _) { { main: [] } }

  validates :name, presence: true, allow_nil: false, allow_blank: false
  validates :description, presence: true, allow_nil: false, allow_blank: false
  validates :service_class, presence: true, allow_nil: false, allow_blank: false
  validate :service_class_exists

  def service_class_exists
    unless 'Service' != service_class && service_class.constantize.ancestors.include?(Service)
      errors.add :service_class, 'must descend from Service'
      return false
    end
    true
  rescue NameError
    errors.add(:service_class, 'does not exist')
    false
  end

  class_attribute :registered_products
  self.registered_products = {}

  def self.[]=(key, product)
    fail(StandardError, "Product '%s' is already registered.".format(key)) if registered_products.key? key
    fail(StandardError, "Product type '%s' is already registered.".format(product.name)) if registered_products.key key
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

  # def initialize
  #   super
  #   valid?
  # end

  def as_json(_)
    { name: name, type: type, listing_form: listing_form, service_form: service_form }
  end
end
