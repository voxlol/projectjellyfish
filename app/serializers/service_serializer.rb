class ServiceSerializer < ApplicationSerializer
  attributes :id, :product_id, :provision_status, :latest_alert_id
  attributes :service_name, :service_description
  attributes :project_id, :project_name, :project_description

  has_one :order
  has_one :product
  has_one :project
  has_one :latest_alert
end
