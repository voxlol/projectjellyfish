class ServicesController < ApplicationController
  after_action :verify_authorized

  api :GET, '/services', 'Returns all services'
  param :includes, Array, in: %w(project order product product_type)
  param :page, :number
  param :per_page, :number

  def index
    authorize Service
    respond_with_params services
  end

  api :GET, '/services/:id', 'Returns a service'
  param :id, :number, required: true
  param :includes, Array, in: %w(project order product product_type)
  error code: 404, desc: MissingRecordDetection::Messages.not_found

  def show
    authorize service
    respond_with_params service
  end

  private

  def services
    @_services ||= query_with Service.all, :includes, :pagination
  end

  def service
    @_service = (query_with Service.where(id: params.require(:id)), :includes).first || fail(ActiveRecord::RecordNotFound)
  end
end
