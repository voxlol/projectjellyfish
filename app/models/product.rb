# == Schema Information
#
# Table name: products
#
#  id              :integer          not null, primary key
#  name            :string(255)
#  description     :text
#  active          :boolean
#  img             :string(255)
#  created_at      :datetime
#  updated_at      :datetime
#  deleted_at      :datetime
#  setup_price     :decimal(10, 4)   default(0.0)
#  hourly_price    :decimal(10, 4)   default(0.0)
#  monthly_price   :decimal(10, 4)   default(0.0)
#  cached_tag_list :string
#  product_type_id :integer          not null
#  type            :string           not null
#  properties      :json
#
# Indexes
#
#  index_products_on_deleted_at       (deleted_at)
#  index_products_on_product_type_id  (product_type_id)
#

class Product < ActiveRecord::Base
  acts_as_paranoid
  acts_as_taggable

  store_accessor :options

  has_many :chargebacks
  belongs_to :product_type

  # delegate :provisioner, to: :product_type
  #
  # def product_type
  #   ProductType.new(self[:product_type])
  # end
end

require 'null_product'
