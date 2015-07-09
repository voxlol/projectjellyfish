# == Schema Information
#
# Table name: roles
#
#  id          :integer          not null, primary key
#  name        :string
#  description :text
#  permissions :jsonb
#

class RoleSerializer < ActiveModel::Serializer
  attributes :id, :name, :description, :permissions
end
