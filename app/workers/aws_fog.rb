class AwsFog
  def initialize(order_item_id)
    Delayed::Worker.logger.debug 'Initializing Fog'
    @order_item_id = order_item_id
    Fog.mock! # if ENV['MOCK_MODE'] == 'true'
  end

  def provision
    Delayed::Worker.logger.debug "Your password: #{order_item}"
    product_type = order_item.product.product_type.name.capitalize.downcase
    method_call = method("provision_#{product_type}")
    method_call.call
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

  # TODO: come up for better method than this to fix branch condition size rubocop issues
  def order_item_details_camelize
    details = {}
    answers = order_item.product.answers
    order_item.product.product_type.questions.each do |question|
      answer = answers.select { |row| row.product_type_question_id == question.id }.first
      if questions.manageiq_key == 'db_instance_class'
        details['DBInstanceClass'] = answer.nil? ? question.default : answer.answer
      else
        details[question.manageiq_key.camelize] = answer.nil? ? question.default : answer.answer
      end
    end
    details
  end

  def aws_settings
    @aws_settings ||= Setting.find_by(hid: 'aws').settings_hash
  end

  def provision_infrastructure
    aws_connection = Fog::Compute.new(
      provider: 'AWS',
      aws_access_key_id: aws_settings[:access_key],
      aws_secret_access_key: aws_settings[:secret_key]
    )
    details = order_item_details
    # TODO: Must get an image_id from product types
    details['image_id'] = 'ami-acca47c4'
    begin
      server = aws_connection.servers.create(details)
      server.wait_for { ready? }
    rescue StandardError => e
      Delayed::Worker.logger.debug "Caught standard error #{e.message}"
      order_item.provision_status = 'critical'
      order_item.status_msg = e.message
      order_item.save
      exit
    end
    # Store the created server information
    order_item.public_ip = server.public_ip_address
    order_item.instance_id = server.id
    order_item.private_ip = server.private_ip_address
    order_item.provision_status = 'ok'
    order_item.save
  end

  def provision_storage
    # Create the storage connection
    aws_connection = Fog::Storage.new(
      provider: 'AWS',
      aws_access_key_id: aws_settings[:access_key],
      aws_secret_access_key: aws_settings[:secret_key]
    )
    instance_name = "id-#{order_item.uuid[0..9]}"
    begin
      storage = aws_connection.directories.create(
        key: order_item.uuid[0..9], # key is the name of the bucket
        public: true
      )
    rescue StandardError => e
      order_item.provision_status = 'critical'
      Delayed::Worker.logger.debug "Error message: #{e.message}"
      Delayed::Worker.logger.debug "Cause: #{e.cause}"
      order_item.status_msg = e.message
      order_item.save
      exit
    end
    order_item.url = storage.public_url
    order_item.instance_name = instance_name
    order_item.provision_status = 'ok'
    order_item.save
  end

  def provision_databases
    @aws_connection = Fog::AWS::RDS.new(
      aws_access_key_id: aws_settings[:access_key],
      aws_secret_access_key: aws_settings[:secret_key]
    )
    sec_pw = SecureRandom.hex[0..9]
    options = order_item_details_camelize
    # TODO: Figure out solution for camelcase / snake case issues
    options['MasterUserPassword'] = sec_pw
    options['MasterUsername'] = 'admin'
    Delayed::Worker.logger.debug "Updated details: #{options}"
    db_instance_id = "id-#{@order_item.uuid[0..9]}"
    db = @aws_connection.create_db_instance(db_instance_id, options)
    order_item.provision_status = 'ok'
    order_item.username = 'admin'
    order_item.password = BCrypt::Password.create(sec_pw)
    order_item.instance_name = db_instance_id
    order_item.port = db.local_port
    order_item.url = db.local_address
    order_item.public_ip = db.remote_ip
    order_item.save
  end

  def retire_infrastructure
  end

  def retire_storage
  end

  def retire_databases
  end
end
