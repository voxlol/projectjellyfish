# == Schema Information
#
# Table name: orders
#
#  id              :integer          not null, primary key
#  staff_id        :integer          not null
#  engine_response :text
#  active          :boolean
#  created_at      :datetime
#  updated_at      :datetime
#  options         :jsonb
#  deleted_at      :datetime
#  total           :float            default(0.0)
#
# Indexes
#
#  index_orders_on_deleted_at  (deleted_at)
#  index_orders_on_staff_id    (staff_id)
#

class OrderSerializer < ApplicationSerializer
  attributes :id, :staff_id, :active, :total, :created_at, :updated_at

  has_one :staff
  has_many :order_items
end
