FactoryGirl.define do
  factory :order do
    product
    setup_price 0.0
    monthly_price 0.0
    hourly_price 0.0
  end
end
