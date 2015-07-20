# == Schema Information
#
# Table name: product_types
#
#  id            :integer          not null, primary key
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  type          :string           not null
#  uuid          :string           not null
#  name          :string           not null
#  description   :text
#  service_class :string           not null
#  product_form  :json             not null
#  service_form  :json             not null
#  active        :boolean          default(TRUE), not null
#  deprecated    :boolean          default(FALSE), not null
#
# Indexes
#
#  index_product_types_on_type  (type)
#  index_product_types_on_uuid  (uuid)
#

class ProductType < ActiveRecord::Base
  has_many :products

  validates :name, presence: true, allow_nil: false, allow_blank: false
  validates :service_class, presence: true, allow_nil: false, allow_blank: false
  validate :service_class_exists

  def self.create(opts)
    product_type = ProductType.find_by uuid: opts[:uuid]
    product_type.nil? ? super(opts) : create_existing(product_type, opts)
  end

  def self.create!(opts)
    product_type = ProductType.find_by uuid: opts[:uuid]
    product_type.nil? ? super(opts) : create_existing(product_type, opts)
  end

  def self.policy_class
    ProductTypePolicy
  end

  private

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

  def self.create_existing(product_type, opts)
    columns = [:name, :description, :service_class, :product_form, :service_form, :deprecated]
    to_update = Hash[opts.select { |k, _| columns.include? k }]
    product_type.update_attributes to_update
    product_type.update_column :type, opts[:type] if product_type.type != opts[:type]
    product_type
  end

  def self.load_product_types
    ProductType.table_exists?
  rescue
    false
  end

  def self.set(name, uuid, description: '', service_class: nil,
    product_form: { main: [] }, service_form: { main: [] }, deprecated: false)

    {
      name: name,
      uuid: uuid,
      description: description,
      service_class: service_class,
      product_form: product_form,
      service_form: service_form,
      deprecated: deprecated
    }
  end

end

# class ProductType
#   include Virtus.model
#   include ActiveModel::Validations
#   include ActiveModel::Serialization
#   include ActiveModel::SerializerSupport
#
#   attribute :uuid, String
#   attribute :name, String
#   attribute :description, String
#   attribute :service_class, String
#   attribute :listing_form, Hash, default: -> (_, _) { { main: [] } }
#   attribute :service_form, Hash, default: -> (_, _) { { main: [] } }
#
#   validates :name, presence: true, allow_nil: false, allow_blank: false
#   validates :description, presence: true, allow_nil: false, allow_blank: false
#   validates :service_class, presence: true, allow_nil: false, allow_blank: false
#   validate :service_class_exists
#
#   def service_class_exists
#     unless 'Service' != service_class && service_class.constantize.ancestors.include?(Service)
#       errors.add :service_class, 'must descend from Service'
#       return false
#     end
#     true
#   rescue NameError
#     errors.add(:service_class, 'does not exist')
#     false
#   end
#
#   class_attribute :registered_products
#   self.registered_products = {}
#
#   def self.[]=(key, product)
#     fail(StandardError, "Product '%s' is already registered.".format(key)) if registered_products.key? key
#     fail(StandardError, "Product type '%s' is already registered.".format(product.name)) if registered_products.key key
#     registered_products[key] = product
#   end
#
#   def self.[](key)
#     registered_products[key]
#   end
#
#   def self.types
#     registered_products.keys
#   end
#
#   def self.all
#     registered_products.values
#   end
#
#   # def initialize
#   #   super
#   #   valid?
#   # end
#
#   def as_json(_)
#     { name: name, type: type, listing_form: listing_form, service_form: service_form }
#   end
# end
