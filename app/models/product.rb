# == Schema Information
#
# Table name: products
#
#  id                   :integer          not null, primary key
#  name                 :string(255)
#  description          :text
#  active               :boolean
#  img                  :string(255)
#  created_at           :datetime
#  updated_at           :datetime
#  deleted_at           :datetime
#  setup_price          :decimal(10, 4)   default(0.0)
#  hourly_price         :decimal(10, 4)   default(0.0)
#  monthly_price        :decimal(10, 4)   default(0.0)
#  provisioning_answers :jsonb
#  product_type         :string
#
# Indexes
#
#  index_products_on_deleted_at  (deleted_at)
#

class Product < ActiveRecord::Base
  acts_as_paranoid
  acts_as_taggable

  before_create :tag_contexts

  store_accessor :options
  attr_accessor :taggable_tags

  has_many :chargebacks

  delegate :provisioner, to: :product_type

  def tag_contexts
    context = product_type.name.parameterize.underscore.downcase.to_sym
    set_tag_list_on(context, taggable_tags) unless taggable_tags.nil?
  end

  def product_type
    ProductType.new(self[:product_type])
  end
end
