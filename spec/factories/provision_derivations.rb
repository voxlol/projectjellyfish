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

FactoryGirl.define do
  factory :provision_derivation do
    id ''
    order_item nil
    name 'MyText'
    value 'MyText'
  end
end
