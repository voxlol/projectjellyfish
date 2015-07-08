class GroupStaffSerializer < ApplicationSerializer
  attributes :id, :created_at, :updated_at

  # Relationships
  belongs_to :staff
  belongs_to :group
end
