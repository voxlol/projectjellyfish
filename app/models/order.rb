# == Schema Information
#
# Table name: orders
#
#  id                 :integer          not null, primary key
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  project_id         :integer          not null
#  product_listing_id :integer          not null
#  service_id         :integer          not null
#  setup_price        :decimal(10, 4)
#  hourly_price       :decimal(10, 4)
#  monthly_price      :decimal(10, 4)
#
# Indexes
#
#  index_orders_on_product_listing_id  (product_listing_id)
#  index_orders_on_project_id          (project_id)
#  index_orders_on_service_id          (service_id)
#

class Order < ActiveRecord::Base
  belongs_to :product_listing, class_name: 'Product::Listing'
  belongs_to :project
  belongs_to :service
end
