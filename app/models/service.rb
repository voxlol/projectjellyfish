# == Schema Information
#
# Table name: services
#
#  id         :integer          not null, primary key
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  type       :string           not null
#  uuid       :string           not null
#  name       :string           not null
#  health     :integer          default(0), not null
#  status     :integer
#  status_msg :string
#
# Indexes
#
#  index_services_on_type  (type)
#  index_services_on_uuid  (uuid)
#

class Service < ActiveRecord::Base
  has_many :alerts, as: :alertable
  has_many :latest_alerts, -> { latest }, class_name: 'Alert', as: :alertable

  has_one :order
  has_one :project, through: :order
  has_one :product, through: :order
  has_one :product_type, through: :product

  enum health: { ok: 0, warning: 1, critical: 2 }
  enum status: {
    unknown: 0,
    pending: 1,
    provisioning: 2,
    starting: 3,
    running: 4,
    available: 5,
    stopping: 6,
    stopped: 7,
    unavailable: 8,
    retired: 9,
    terminated: 10
  }

  before_create :ensure_uuid

  def self.policy_class
    ServicePolicy
  end

  def actions
    []
  end

  private

  def ensure_uuid
    self[:uuid] = SecureRandom.uuid if self[:uuid].nil?
  end
end
