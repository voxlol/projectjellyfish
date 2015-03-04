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

  def miq_provision
    message =
      {
        action: 'order',
        resource: {
          href: "#{miq_settings[:url]}/api/service_templates/#{order_item.product.service_type_id}",
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
    order_item.save

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

  def handle_response(resource, message)
    response = resource["api/service_catalogs/#{order_item.product.service_catalog_id}/service_templates"].post message.to_json, content_type: 'application/json'

    begin
      data = ActiveSupport::JSON.decode(response)
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

      # Since the exception was caught delayed_jobs wouldn't requeue the job, let's raise an exception
      raise 'error'
    ensure
      order_item.save
    end

    order_item.to_json
  end
end
