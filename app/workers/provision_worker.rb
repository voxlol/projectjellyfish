class ProvisionWorker
  def initialize(order_item_id)
    @order_item_id = order_item_id
    @provision = Provision.new(order_item_id)
  end

  def provision
    @provision
  end

  def provider
    Providers.new
  end

  def perform
    if provider.miq_settings[:enabled]
      miq_provision
    else
      # TODO: Provision according to cloud provider using fog.io
      fog_provision = "#{provision.cloud}Fog".constantize
      fog_provision.new(@order_item_id).execute
    end
  end

  private

  def miq_provision
    message =
      {
        action: 'order',
        resource: {
          href: "#{provider.miq_settings[:url]}/api/service_templates/#{provision.order_item.product.service_type_id}",
          referer: ENV['DEFAULT_URL'], # TODO: Move this into a manageiq setting
          email: provider.miq_user.email,
          token: provider.miq_settings[:token],
          order_item: {
            id: provision.order_item.id,
            uuid: provision.order_item.uuid.to_s,
            product_details: provision.order_item_details
          }
        }
      }
    provision.order_item.provision_status = :unknown
    provision.order_item.payload_to_miq = message.to_json
    provision.order_item.save

    # TODO: verify_ssl needs to be changed, this is the only way I could get it to work in development.
    resource = RestClient::Resource.new(
      provider.miq_settings[:url],
      user: provider.miq_settings[:username],
      password: provider.miq_settings[:password],
      verify_ssl: OpenSSL::SSL::VERIFY_NONE,
      timeout: 120,
      open_timeout: 60
    )
    handle_response resource, message
  end

  def handle_response(resource, message)
    response = resource["api/service_catalogs/#{provision.order_item.product.service_catalog_id}/service_templates"].post message.to_json, content_type: 'application/json'

    begin
      data = ActiveSupport::JSON.decode(response)
      provision.order_item.payload_reply_from_miq = data.to_json

      case response.code
      when 200..299
        provision.order_item.provision_status = :pending
        provision.order_item.miq_id = data['results'][0]['id']
      when 400..407
        provision.order_item.provision_status = :critical
      else
        provision.order_item.provision_status = :warning
      end

    rescue => e
      provision.order_item.provision_status = :unknown
      provision.order_item.payload_reply_from_miq = {
        error: e.try(:response) || 'Request Timeout',
        message: e.try(:message) || "Action response was out of bounds, or something happened that wasn't expected"
      }.to_json

      # Since the exception was caught delayed_jobs wouldn't requeue the job, let's raise an exception
      raise 'error'
    ensure
      provision.order_item.save
    end

    provision.order_item.to_json
  end
end
