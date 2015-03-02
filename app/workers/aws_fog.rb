class AwsFog
  def initialize(order_item_id)
    @order_item_id = order_item_id
  end

  def provision
    ENV['MOCK_MODE'] == 'true' ? Fog.mock! : Fog.unmock!
    product_type = order_item.product.product_type.name.capitalize.downcase
    begin
      send("provision_#{product_type}")
    rescue Excon::Errors::BadRequest
      order_item.provision_status = :critical
      order_item.status_msg = 'Bad request. Check authorization credentials.'
    rescue ArgumentError, StandardError, Fog::Compute::AWS::Error, NoMethodError  => e
      order_item.provision_status = :critical
      order_item.status_msg = e.message
    ensure
      order_item.save
    end
  end

  def order_item
    @order_item ||= OrderItem.find @order_item_id
  end

  def aws_settings
    @aws_settings ||= Setting.find_by(hid: 'aws').settings_hash
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

  # TODO: Need to come up with a better way to manage CamelCase vs snake_case for DB instance creation
  def rds_details
    details = {}
    answers = order_item.product.answers
    order_item.product.product_type.questions.each do |question|
      answer = answers.select { |row| row.product_type_question_id == question.id }.first
      question_key = question.manageiq_key
      case question_key
      when 'db_instance_class'
        details['DBInstanceClass'] = answer.nil? ? question.default : answer.answer
      else
        details[question_key.camelize] = answer.nil? ? question.default : answer.answer
      end
    end
    details
  end

  def infrastructure_connection
    aws_connection = Fog::Compute.new(
      provider: 'AWS',
      aws_access_key_id: aws_settings[:access_key],
      aws_secret_access_key: aws_settings[:secret_key]
    )
    aws_connection
  end

  def provision_infrastructure
    aws_connection = infrastructure_connection
    details = order_item_details
    # TODO: Must get an image_id from product types
    details['image_id'] = 'ami-acca47c4'
    server = aws_connection.servers.create(details)
    server.wait_for { ready? }
    order_item.public_ip = server.public_ip_address
    order_item.instance_id = server.id
    order_item.private_ip = server.private_ip_address
    order_item.provision_status = :ok
  end

  def storage_connection
    aws_connection = Fog::Storage.new(
      provider: 'AWS',
      aws_access_key_id: aws_settings[:access_key],
      aws_secret_access_key: aws_settings[:secret_key]
    )
    aws_connection
  end

  def provision_storage
    aws_connection = storage_connection
    instance_name = "id-#{order_item.uuid[0..9]}"
    storage = aws_connection.directories.create(
      key: instance_name,
      public: true
    )
    order_item.url = storage.public_url
    order_item.instance_name = instance_name
    order_item.provision_status = 'ok'
  end

  def databases_connection
    aws_connection = Fog::AWS::RDS.new(
      aws_access_key_id: aws_settings[:access_key],
      aws_secret_access_key: aws_settings[:secret_key]
    )
    aws_connection
  end

  def provision_databases
    aws_connection = databases_connection
    @sec_pw = SecureRandom.hex 5
    details = rds_details
    # TODO: Figure out solution for camelcase / snake case issues
    details['MasterUserPassword'] = @sec_pw
    details['MasterUsername'] = 'admin'
    @db_instance_id = "id-#{@order_item.uuid[0..9]}"
    db = aws_connection.create_db_instance(@db_instance_id, details)
    save_db_item(db)
  end

  def save_db_item(db)
    order_item.provision_status = :ok
    order_item.username = 'admin'
    order_item.password = BCrypt::Password.create(@sec_pw)
    order_item.instance_name = @db_instance_id
    order_item.port = db.local_port
    order_item.url = db.local_address
    order_item.public_ip = db.remote_ip
  end
end
