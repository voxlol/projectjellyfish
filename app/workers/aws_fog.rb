class AwsFog
  def initialize
    @aws_setting = Setting.where(name: 'AWS').first
    @aws_setting_field = SettingField.where(setting_id: @aws_setting.id).order(load_order: :asc).as_json
    Fog.mock! if ENV['MOCK_MODE'] == 'true'
  end

  def provision(order_item)
    @order_item = order_item
    product_type = order_item.product.product_type.name.capitalize.downcase
    method_call = method("provision_#{product_type}")
    method_call.call
  end

  def provision_infrastructure
    @aws_connection = Fog::Compute.new(
      provider: 'AWS',
      aws_access_key_id: @aws_setting_field[1]['value'],
      aws_secret_access_key: @aws_setting_field[2]['value']
    )
    answers = @order_item.product.answers
    details = {}
    # TODO: Change ProductType structure so that the key needed
    # is the product type for each hash needed for product creation
    answers.each do |answer|
      question = ProductTypeQuestion.where(id: answer.product_type_question_id).first.manageiq_key
      details[question] = answer.answer
    end
    # TODO: Must get an image_id from product types
    details['image_id'] = 'ami-acca47c4'
    begin
      server = @aws_connection.servers.create(details)
      # Waiting for it to boot
      server.wait_for { ready? }
    rescue StandardError => e
      Delayed::Worker.logger.debug "Caught standard error #{e.message}"
      @order_item.provision_status = 'critical'
      @order_item.status_msg = e.message
      @order_item.save
    end
    # Store the created server information
    @order_item.public_ip = server.public_ip_address
    @order_item.private_ip = server.private_ip_address
    @order_item.provision_status = 'ok'
    @order_item.save
  end

  def provision_storage
    # Create the storage connection
    @aws_connection = Fog::Storage.new(
      provider: 'AWS',
      aws_access_key_id: @aws_setting_field[1]['value'],
      aws_secret_access_key: @aws_setting_field[2]['value']
    )
    instance_name = "id-#{@order_item.uuid[0..9]}"
    begin
      storage = @aws_connection.directories.create(
        key: @order_item.uuid[0..9], # key is the name of the bucket
        public: true
      )
    rescue StandardError => e
      @order_item.provision_status = 'critical'
      Delayed::Worker.logger.debug "Error message: #{e.message}"
      Delayed::Worker.logger.debug "Cause: #{e.cause}"
      @order_item.status_msg = e.message
      @order_item.save
    end
    @order_item.url = storage.public_url
    @order_item.instance_name = instance_name
    @order_item.provision_status = 'ok'
    @order_item.save
  end

  def provision_databases
    @aws_connection = Fog::AWS::RDS.new(
      aws_access_key_id: @aws_setting_field[1]['value'],
      aws_secret_access_key: @aws_setting_field[2]['value']
    )
    details = {}
    answers.each do |answer|
      question = ProductTypeQuestion.where(id: answer.product_type_question_id).first.manageiq_key
      details[question] = answer.answer
    end
  end

  def retire_infrastructure
  end

  def retire_storage
  end

  def retire_databases
  end
end
