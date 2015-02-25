class ProvisionWorker < Provisioner
  def initialize(order_item_id)
    @order_item_id = order_item_id
  end

  def perform
    if miq_settings[:enabled]
      Delayed::Worker.logger.debug "Miq settings url = #{miq_settings[:enabled]}"
      miq_provision
    else
      # TODO: Provision according to cloud provider using fog.io
      fog_provision = "#{cloud}Fog".constantize
      fog_provision.new(@order_item_id).provision
    end
  end

  private

  def order_item
    @order_item ||= OrderItem.find @order_item_id
  end

  def miq_settings
    @miq_settings ||= Setting.find_by(hid: 'manageiq').settings_hash
  end

  def miq_user
    @miq_user ||= Staff.find_by email: miq_settings[:email]
  end

  def service_type_id
    order_item.product.provisionable.service_type_id
  end

  def miq_provision
    message =
      {
        action: 'order',
        resource: {
          href: "#{miq_settings[:url]}/api/service_templates/#{service_type_id}",
          referer: ENV['DEFAULT_URL'], # TODO: Move this into a manageiq setting
          email: miq_settings[:email],
          token: miq_settings[:token],
          order_item: {
            id: order_item.id,
            uuid: order_item.uuid.to_s,
            product_details: order_item_details
          }
        }
      }
    order_item.provision_status = :unknown
    order_item.payload_request = message.to_json
    order_item.save!

    # TODO: verify_ssl needs to be changed, this is the only way I could get it to work in development.
    resource = RestClient::Resource.new(
      miq_settings[:url],
      user: miq_settings[:username],
      password: miq_settings[:password],
      verify_ssl: OpenSSL::SSL::VERIFY_NONE,
      timeout: 120,
      open_timeout: 60
    )
    handle_response resource, message
  end

  def service_catalog_id
    order_item.product.provisionable.service_catalog_id
  end

  def handle_response(resource, message)
    response = resource["api/service_catalogs/#{service_catalog_id}/service_templates"].post message.to_json, content_type: 'application/json'

    begin
      data = ActiveSupport::JSON.decode(response.body)
      order_item.payload_acknowledgement = data.to_json

      case response.code
      when 200..299
        order_item.provision_status = :pending
        order_item.miq_id = data['results'][0]['id']
      when 400..407
        order_item.provision_status = :critical
      else
        order_item.provision_status = :warning
      end

    rescue => e
      order_item.provision_status = :unknown
      order_item.payload_acknowledgement = {
        error: e.try(:response) || 'Request Timeout',
        message: e.try(:message) || "Action response was out of bounds, or something happened that wasn't expected"
      }.to_json

      raise e
    ensure
      order_item.save!
    end

    order_item.to_json
  end

  def aws_settings
    @aws_settings ||= Setting.find_by(hid: 'aws').settings_hash
  end

  def order_item_details
    details = {}
    answers = order_item.product.answers

    order_item.product.product_type.questions.each do |question|
      answer = answers.select do |row|
        row.product_type_question_id == question.id
      end.first

      details[question.manageiq_key] = answer.nil? ? question.default : answer.answer
    end

    if aws_settings[:enabled]
      details['access_key_id'] = aws_settings[:access_key]
      details['secret_access_key'] = aws_settings[:secret_key]
      details['image_id'] = 'ami-acca47c4'
    end

    details
  end
end
