class ServiceActionsController < ApplicationController

  def_param_group :service_action_params do
    param :id, Integer, desc: 'ID of the service acted upon', allow_nil: false
    param :operation, String, desc: 'Name of the action to execute on the service', allow_nil: false
  end

  api :PUT, '/services/:id/actions/:operation', 'Updates service :id with action :action'
  param_group :service_action_params
  error code: 404, desc: MissingRecordDetection::Messages.not_found
  error code: 422, desc: ParameterValidation::Messages.missing

  def update
    authorize service, :action?
    service.operations params[:operation]
    respond_with service
  end

  private

  def service
    @_service = Service.find params[:id]
  end
end
