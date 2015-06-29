# == Schema Information
#
# Table name: alerts
#
#  id            :integer          not null, primary key
#  project_id    :integer
#  staff_id      :integer
#  status        :string(20)
#  message       :text
#  start_date    :datetime
#  end_date      :datetime
#  created_at    :datetime
#  updated_at    :datetime
#  order_item_id :integer
#
# Indexes
#
#  index_alerts_on_end_date    (end_date)
#  index_alerts_on_start_date  (start_date)
#  index_order_item_id         (order_item_id)
#

class AlertSerializer < ApplicationSerializer
  attributes :id, :status, :message, :category
  attributes :start_date, :end_date, :created_at, :updated_at
end
