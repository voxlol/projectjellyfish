class Provisioner
  attr_reader :order_item

  def initialize(order_item)
    @order_item = order_item
  end

  def aws_settings; end
end
