class AlertSerializer < ApplicationSerializer
  attributes :id, :project_id, :staff_id, :order_item_id, :status, :message,
             :start_date, :end_date, :created_at, :updated_at
end
