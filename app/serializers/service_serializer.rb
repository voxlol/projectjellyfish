#
# If you're using this file !!STOP!! and start using OrderItemSerializer
#
class ServiceSerializer < ApplicationSerializer
  attributes :id, :product_id, :project_id, :provision_status, :latest_alert_id

  has_one :order
  has_one :product
  has_one :project
  has_one :latest_alert
end
