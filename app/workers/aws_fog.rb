class AwsFog < Provisioner
  def initialize(order_item_id)
    @order_item_id = order_item_id
  end

  def provision
    mock_mode
    begin
      send "provision_#{product_type}".to_sym
    rescue Excon::Errors::BadRequest
      critical_error('Bad request. Check authorization credentials.')
    rescue ArgumentError, StandardError, Fog::Compute::AWS::Error, NoMethodError  => e
      critical_error(e.message)
    ensure
      order_item.save!
    end
  end

  # TODO: Need to come up with a better way to manage CamelCase vs snake_case for DB instance creation
  def rds_details
    details = {}
    order_item_details.each do |key, value|
      case key
      when 'db_instance_class'
        details['DBInstanceClass'] = value
      else
        details[key.camelize] = value
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
    save_item(server)
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
    instance_name = "id-#{provision.order_item.uuid[0..9]}"
    storage = aws_connection.directories.create(
      key: instance_name,
      public: true
    )
    save_item(storage)
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
    @db_instance_id = "id-#{order_item.uuid[0..9]}"
    db = aws_connection.create_db_instance(@db_instance_id, details)
    save_item(db)
  end
end
