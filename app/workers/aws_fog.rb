class AwsFog
  attr_accessor :provision
  attr_accessor :provider

  def initialize(order_item_id)
    provision = Provision.new(order_item_id)
  end

  def provision
    @provision
  end

  def provider
    Providers.new
  end

  def execute
    provision.mock_mode
    begin
      send "provision_#{provision.product_type}".to_sym
    rescue Excon::Errors::BadRequest
      provision.critical_error('Bad request. Check authorization credentials.')
    rescue ArgumentError, StandardError, Fog::Compute::AWS::Error, NoMethodError  => e
      provision.critical_error(e.message)
    ensure
      provision.order_item.save
    end
  end

  # TODO: Need to come up with a better way to manage CamelCase vs snake_case for DB instance creation
  def rds_details
    details = {}
    answers = provision.order_item.product.answers
    provision.order_item.product.product_type.questions.each do |question|
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
      aws_access_key_id: provider.aws_settings[:access_key],
      aws_secret_access_key: provider.aws_settings[:secret_key]
    )
    aws_connection
  end

  def provision_infrastructure
    aws_connection = infrastructure_connection
    details = provision.order_item_details
    # TODO: Must get an image_id from product types
    details['image_id'] = 'ami-acca47c4'
    server = aws_connection.servers.create(details)
    server.wait_for { ready? }
    provision.order_item.public_ip = server.public_ip_address
    provision.order_item.instance_id = server.id
    provision.order_item.private_ip = server.private_ip_address
    provision.order_item.provision_status = :ok
  end

  def storage_connection
    aws_connection = Fog::Storage.new(
      provider: 'AWS',
      aws_access_key_id: provider.aws_settings[:access_key],
      aws_secret_access_key: provider.aws_settings[:secret_key]
    )
    aws_connection
  end

  def provision_storage
    aws_connection = storage_connection
    instance_name = "id-#{provision.order_item.uuid[0..9]}"
    storage = aws_connection.directories.create(
      key: instance_name,
      public: true
    )
    provision.order_item.url = storage.public_url
    provision.order_item.instance_name = instance_name
    provision.order_item.provision_status = 'ok'
  end

  def databases_connection
    aws_connection = Fog::AWS::RDS.new(
      aws_access_key_id: provider.aws_settings[:access_key],
      aws_secret_access_key: provider.aws_settings[:secret_key]
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
    @db_instance_id = "id-#{provision.order_item.uuid[0..9]}"
    db = aws_connection.create_db_instance(@db_instance_id, details)
    save_db_item(db)
  end

  def save_db_item(db)
    provision.order_item.provision_status = :ok
    provision.order_item.username = 'admin'
    provision.order_item.password = BCrypt::Password.create(@sec_pw)
    provision.order_item.instance_name = @db_instance_id
    provision.order_item.port = db.local_port
    provision.order_item.url = db.local_address
    provision.order_item.public_ip = db.remote_ip
  end
end
