FactoryGirl.define do
  factory :alert do
    status 'ok'
    message 'This is a test alert'
    start_date 'NULL'
    end_date 'NULL'

    trait :warning do
      status 'WARNING'
      message 'This is a WARNING alert.'
    end

    trait :critical do
      status 'CRITICAL'
      message 'This is a CRITICAL alert.'
    end

    trait :unknown do
      status 'UNKNOWN'
      message 'This is an UNKNOWN alert.'
    end

    trait :active do
      status 'WARNING'
      message 'This alert is within its start and end dates.'
      start_date "#{Time.zone.now}" # START DATE NOW
      end_date "#{Time.zone.now + 1.day}" # END DATE NOT SET
    end

    trait :inactive do
      status 'WARNING'
      message 'This alert is not within its start and end dates.'
      start_date "#{Time.zone.now - 2.days}" # YESTERDAY - 1
      end_date "#{Time.zone.now - 1.day}" # YESTERDAY
    end

    # trait :first do
    #   project_id '3'
    #   staff_id '0'
    #   order_item_id '1'
    #   status 'WARNING'
    #   message 'This is a WARNING alert for the first service of project 3.'
    # end
    #
    # trait :second do
    #   project_id '3'
    #   staff_id '0'
    #   order_item_id '2'
    #   status 'CRITICAL'
    #   message 'This is a CRITICAL alert for the second service of project 3'
    # end
    #
    # trait :third do
    #   project_id '3'
    #   staff_id '0'
    #   order_item_id '3'
    #   status 'UNKNOWN'
    #   message 'This is an UNKNOWN alert for the third service of project 3'
    # end
  end
end
