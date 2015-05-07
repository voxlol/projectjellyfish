FactoryGirl.define do
  factory :role do
    name 'Administrator'
    description 'Administratin things'
    permissions(
      'projects' => %(read write),
      'approvals' => %(read write),
      'affiliations' => %(read write)
    )
  end
end
