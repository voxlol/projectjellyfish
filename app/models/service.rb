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
  has_one :order
  has_one :project, through: :order
  has_one :product, through: :order
  has_one :product_type, through: :product

  enum status: { ok: 0, warning: 1, critical: 2, unknown: 3, pending: 4, retired: 5 }

  def self.policy_class
    ServicePolicy
  end

  def actions
    []
  end
end
