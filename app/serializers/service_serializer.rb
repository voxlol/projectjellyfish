class ServiceSerializer < ApplicationSerializer
  attributes :id, :project_id, :product_id, :provision_status, :latest_alert_id, :project_name, :project_description, :service_name, :service_description
end
