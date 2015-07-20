# == Schema Information
#
# Table name: product_types
#
#  id            :integer          not null, primary key
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  type          :string           not null
#  uuid          :string           not null
#  name          :string           not null
#  description   :text
#  service_class :string           not null
#  product_form  :json             not null
#  service_form  :json             not null
#  active        :boolean          default(TRUE), not null
#  deprecated    :boolean          default(FALSE), not null
#
# Indexes
#
#  index_product_types_on_type  (type)
#  index_product_types_on_uuid  (uuid)
#

class ProductTypeSerializer < ApplicationSerializer
  attributes :id, :name, :provider, :description, :product_form, :service_form, :active, :deprecated

  def provider
    object.type.split('::').last
  end
end
