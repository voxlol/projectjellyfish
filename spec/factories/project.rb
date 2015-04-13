FactoryGirl.define do
  factory :project do
    name 'Test Project'
    description 'A description'
    cc '--cc--'
    budget 100.0
    start_date((Time.zone.now + 1.week).to_date)
    end_date((Time.zone.now + 2.week).to_date)
    approval :undecided
    img '/images/no_image.png'

    trait :unapproved do
      approval :rejected
    end
  end
end
