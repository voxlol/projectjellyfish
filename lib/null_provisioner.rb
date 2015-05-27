class NullProvisioner
  def self.provision(*args)
    new(*args).provision
  end

  def self.retire(*args)
    new(*args).retire
  end

  def initialize(order_item_id)
    @order_item_id = order_item_id
  end

  def provision
    @order_item = OrderItem.where(id: @order_item_id).first
    @order_item.provision_status = 'ok'
    @order_item.payload_response = { defaults: {ip_address: '127.0.0.1', total: '0.0', hostname: 'TBD'} }
    @order_item.save!
    true
  end

  def retire
    true
  end
end
