# == Schema Information
#
# Table name: bundles
#
#  id          :integer          not null, primary key
#  name        :string(255)
#  description :text
#  img         :string(255)
#  active_at   :datetime
#  deleted_at  :datetime
#  created_at  :datetime
#  updated_at  :datetime
#

class Bundle < ActiveRecord::Base
  has_many :bundled_products
  has_many :products, through: :bundled_products

  time_for_a_boolean :deleted
  time_for_a_boolean :active
end
