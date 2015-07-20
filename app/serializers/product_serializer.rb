# == Schema Information
#
# Table name: products
#
#  id              :integer          not null, primary key
#  name            :string(255)      not null
#  description     :text
#  active          :boolean          default(TRUE)
#  img             :string(255)
#  created_at      :datetime
#  updated_at      :datetime
#  deleted_at      :datetime
#  setup_price     :decimal(10, 4)   default(0.0)
#  hourly_price    :decimal(10, 4)   default(0.0)
#  monthly_price   :decimal(10, 4)   default(0.0)
#  cached_tag_list :string
#  product_type_id :integer
#
# Indexes
#
#  index_products_on_deleted_at       (deleted_at)
#  index_products_on_product_type_id  (product_type_id)
#

class ProductSerializer < ApplicationSerializer
  attributes :id, :name, :description, :img, :active, :product_type_id
  attributes :setup_price, :hourly_price, :monthly_price
  attributes :created_at, :updated_at, :deleted_at
  attribute :tag_list, key: :tags
end
