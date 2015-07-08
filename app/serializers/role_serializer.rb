class RoleSerializer < ActiveModel::Serializer
  attributes :id, :name, :description, :permissions

  has_many :memberships
end
