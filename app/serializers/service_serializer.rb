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

class ServiceSerializer < ApplicationSerializer
  attributes :id, :uuid, :status, :status_msg, :created_at, :updated_at

  has_one :order
  has_one :project
  has_one :product
  has_one :product_type, serializer: ProductTypeSerializer
end
