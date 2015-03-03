class Provision
  def initialize(order_item_id)
    @order_item_id = order_item_id
  end

  def mock_mode
    ENV['MOCK_MODE'] == 'true' ? Fog.mock! : Fog.unmock!
  end

  def order_item
    @order_item ||= OrderItem.find @order_item_id
  end

  def order_item_details
    details = {}
    answers = order_item.product.answers
    order_item.product.product_type.questions.each do |question|
      answer = answers.select { |row| row.product_type_question_id == question.id }.first
      details[question.manageiq_key] = answer.nil? ? question.default : answer.answer
    end
    details
  end

  def product_type
    order_item.product.product_type.name.capitalize.downcase
  end

  def cloud
    provision.order_item.cloud.name.capitalize
  end

  def critical_error(message)
    order_item.provision_status = :critical
    order_item.status_msg = message
  end

  def warning_error(message)
    order_item.provision_status = :warning
    order_item.status_msg = message
  end
end
