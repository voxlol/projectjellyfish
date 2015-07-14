class ServicesController < ApplicationController
  after_action :verify_authorized

  def show
    respond_with service
  end

  def create
    service = Service.new service_params
    authorize service
    service.save
    respond_with service
  end

  private

  def service_params
    params.permit
  end

  def service
    @_service = Service.find(params[:id]).tap { |pi| authorize pi }
  end
end
