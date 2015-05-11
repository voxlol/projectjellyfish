# == Schema Information
#
# Table name: roles
#
#  id          :integer          not null, primary key
#  name        :string
#  description :text
#  permissions :jsonb
#

class Role < ActiveRecord::Base
  has_many :groups
  has_many :projects, through: :groups
end
