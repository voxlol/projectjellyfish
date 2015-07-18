# == Schema Information
#
# Table name: services
#
#  id           :integer          not null, primary key
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  type         :string           not null
#  product_type :string           not null
#  uuid         :string           not null
#  status       :integer
#  status_msg   :string
#
# Indexes
#
#  index_services_on_product_type  (product_type)
#  index_services_on_type          (type)
#  index_services_on_uuid          (uuid)
#

class Service < ActiveRecord::Base
  has_many :alerts, as: :alertable
  has_one :order
  has_one :project, through: :order
  has_one :product, through: :order

  def actions
    []
  end

  def product
    Product[product_type]
  end
end
