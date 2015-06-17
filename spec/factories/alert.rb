FactoryGirl.define do
  factory :alert do
    status 'ok'
    message 'This is a test alert'
    start_date 'NULL'
    end_date 'NULL'

    trait :warning do
      status 'warning'
      message 'This is a WARNING alert.'
    end

    trait :critical do
      status 'critical'
      message 'This is a CRITICAL alert.'
    end

    trait :unknown do
      status 'unknown'
      message 'This is an UNKNOWN alert.'
    end

    trait :active do
      status 'warning'
      message 'This alert is within its start and end dates.'
      start_date "#{Time.zone.now}" # START DATE NOW
      end_date "#{Time.zone.now + 1.day}" # END DATE NOT SET
    end

    trait :inactive do
      status 'warning'
      message 'This alert is not within its start and end dates.'
      start_date "#{Time.zone.now - 2.days}" # YESTERDAY - 1
      end_date "#{Time.zone.now - 1.day}" # YESTERDAY
    end
  end
end
