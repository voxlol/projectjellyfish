FactoryGirl.define do
  factory :role do
    name 'Administrator'
    description 'Administratin things'
    permissions(
      'projects' => %w(read write),
      'approvals' => %w(read write),
      'memberships' => %w(read write)
    )
  end
end
