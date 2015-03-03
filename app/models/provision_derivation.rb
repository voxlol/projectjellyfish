# == Schema Information
#
# Table name: provision_derivations
#
#  id            :integer          not null, primary key
#  order_item_id :integer
#  name          :text
#  value         :text
#  created_at    :datetime
#  updated_at    :datetime
#
# Indexes
#
#  index_provision_derivations_on_id             (id)
#  index_provision_derivations_on_order_item_id  (order_item_id)
#

class ProvisionDerivation < ActiveRecord::Base
  belongs_to :order_item
end
