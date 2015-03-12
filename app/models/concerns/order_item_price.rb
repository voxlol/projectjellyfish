module OrderItemPrice
  extend ActiveSupport::Concern

  def calculate_price(setup_price, hourly_price, monthly_price, hours_in_month = 750)
    setup_price + monthly_price + (hourly_price * hours_in_month)
  end
end
