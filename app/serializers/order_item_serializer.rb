class OrderItemSerializer < ApplicationSerializer
  attributes :id, :product_id, :project_id, :service_id, :provision_status, :latest_alert_id,
             :uuid, :setup_price, :monthly_price, :hourly_price, :status_msg, :created_at, :updated_at

  has_one :order
  has_one :product
  has_one :project
  has_one :latest_alert
end
