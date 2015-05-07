# == Schema Information
#
# Table name: groups
#
#  id          :integer          not null, primary key
#  created_at  :datetime
#  updated_at  :datetime
#  name        :string
#  description :text
#  role_id     :integer
#

class GroupSerializer < ApplicationSerializer
  attributes :id, :name, :description, :staff_ids
end
