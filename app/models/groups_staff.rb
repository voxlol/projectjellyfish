# == Schema Information
#
# Table name: members
#
#  id         :integer          not null, primary key
#  created_at :datetime
#  updated_at :datetime
#  group_id   :integer
#  staff_id   :integer
#
# Indexes
#
#  index_members_on_group_id  (group_id)
#  index_members_on_staff_id  (staff_id)
#

class GroupsStaff < ActiveRecord::Base
  belongs_to :staff
  belongs_to :group
end
