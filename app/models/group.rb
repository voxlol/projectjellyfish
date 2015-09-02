# == Schema Information
#
# Table name: groups
#
#  id          :integer          not null, primary key
#  created_at  :datetime
#  updated_at  :datetime
#  name        :string
#  description :text
#  staff_count :integer          default(0)
#

class Group < ActiveRecord::Base
  has_many :memberships
  has_many :projects, through: :memberships
  has_many :groups_staff, counter_cache: :staff_count
  has_many :staff, through: :groups_staff, counter_cache: :this_is_here_to_workaround_broken_counter_cache
end
