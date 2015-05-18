# == Schema Information
#
# Table name: order_items
#
#  id                      :integer          not null, primary key
#  order_id                :integer
#  cloud_id                :integer
#  product_id              :integer
#  service_id              :integer
#  provision_status        :integer
#  created_at              :datetime
#  updated_at              :datetime
#  deleted_at              :datetime
#  project_id              :integer
#  miq_id                  :integer
#  uuid                    :uuid
#  setup_price             :decimal(10, 4)   default(0.0)
#  hourly_price            :decimal(10, 4)   default(0.0)
#  monthly_price           :decimal(10, 4)   default(0.0)
#  payload_request         :jsonb
#  payload_acknowledgement :jsonb
#  payload_response        :jsonb
#  latest_alert_id         :integer
#  status_msg              :string
#
# Indexes
#
#  index_order_items_on_cloud_id    (cloud_id)
#  index_order_items_on_deleted_at  (deleted_at)
#  index_order_items_on_miq_id      (miq_id)
#  index_order_items_on_order_id    (order_id)
#  index_order_items_on_product_id  (product_id)
#  index_order_items_on_service_id  (service_id)
#

class OrderItem < ActiveRecord::Base
  # Includes
  acts_as_paranoid
  acts_as_taggable

  # Relationships
  belongs_to :order
  belongs_to :product
  belongs_to :cloud
  belongs_to :project
  has_many :alerts, inverse_of: :order_item
  belongs_to :latest_alert, class_name: 'Alert'

  # Update the parent Order total
  after_create :update_order_total

  # Hooks
  after_commit :provision, on: :create

  # Validations
  validates :product, presence: true
  validate :validate_product_id

  # Columns
  enum provision_status: { ok: 0, warning: 1, critical: 2, unknown: 3, pending: 4, retired: 5 }

  delegate :provisioner, to: :product

  def calculate_price(hours_in_month = 750)
    setup_price + monthly_price + (hourly_price * hours_in_month)
  end

  def answers
    product.provisioning_answers
  end

  private

  def validate_product_id
    errors.add(:product, 'Product does not exist.') unless Product.exists?(product_id)
  end

  def provision
    provisioner.delay(queue: 'provision_request').provision(id)
  end

  def update_order_total
    @orders_params = { total: order.total + calculate_price }
    order.update @orders_params
  end
end
