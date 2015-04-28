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
#  product_type_id      :integer
#  setup_price          :decimal(10, 4)   default(0.0)
#  hourly_price         :decimal(10, 4)   default(0.0)
#  monthly_price        :decimal(10, 4)   default(0.0)
#  provisionable_type   :string
#  provisionable_id     :integer
#  provisioning_answers :json
#
# Indexes
#
#  index_products_on_deleted_at  (deleted_at)
#

class Product < ActiveRecord::Base
  acts_as_paranoid
  acts_as_taggable

  store_accessor :options

  has_many :chargebacks

  delegate :provisioner, to: :product_type

  def product_type
    ProductType.new(self[:product_type])
  end
end
