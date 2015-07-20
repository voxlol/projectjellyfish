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
  has_and_belongs_to_many :staff, counter_cache: true
  has_many :memberships
  has_many :projects, through: :memberships
end
