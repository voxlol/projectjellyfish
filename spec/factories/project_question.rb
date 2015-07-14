FactoryGirl.define do
  factory :project_question do
    question 'Question?'
    field_type :select_option
    help_text 'helping'

    options [
      {
        option: 'One',
        position: 0
      },
      {
        option: 'Two',
        position: 1
      },
      {
        option: 'Three',
        position: 2
      }
    ]

    required true
    position 0

    trait :optional do
      required false
    end

    trait :required_text do
      field_type :text
      position 1
      options %w()
    end
  end
end
