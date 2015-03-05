class MiqProvision < Provisioner
  def initialize(order_item_id)
    @order_item_id = order_item_id
  end

  def provision
    order_item.provision_status = :unknown
    order_item.payload_request = message.to_json
    order_item.save!

    # TODO: verify_ssl needs to be changed, this is the only way I could get it to work in development.
    handle_response resource, message
  end

  def resource
    RestClient::Resource.new(
      miq_settings[:url],
      user: miq_settings[:username],
      password: miq_settings[:password],
      verify_ssl: OpenSSL::SSL::VERIFY_NONE,
      timeout: 120,
      open_timeout: 60
    )
  end

  def message
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
  end

  def handle_response(resource, message)
    response = resource["api/service_catalogs/#{service_type_id}/service_templates"].post message.to_json, content_type: 'application/json'

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
end
