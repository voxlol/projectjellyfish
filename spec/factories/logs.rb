# == Schema Information
#
# Table name: logs
#
#  id            :integer          not null, primary key
#  log_level     :integer
#  message       :string
#  loggable_type :string
#  loggable_id   :integer
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#

FactoryGirl.define do
  factory :log do
    log_level 1
    message 'Test message'

    loggable
  end

  factory :service_log, class: 'Log' do
    association :loggable, factory: :log
  end
end
