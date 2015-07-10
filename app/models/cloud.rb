# == Schema Information
#
# Table name: clouds
#
#  id          :integer          not null, primary key
#  name        :string(255)
#  description :text
#  created_at  :datetime
#  updated_at  :datetime
#  deleted_at  :datetime
#  settings    :json
#  properties  :json
#
# Indexes
#
#  index_clouds_on_deleted_at  (deleted_at)
#

class Cloud < ActiveRecord::Base
  acts_as_paranoid

  has_many :chargebacks
  has_many :product_types
end
