class ApiTokensController < ApplicationController
  prepend_before_filter :allow_params_authentication!, only: :create
  api :POST, '/api_token', 'Creates a api_token'
  param :staff, Hash, desc: 'Staff' do
    param :email, String, desc: 'Email'
    param :password, String, desc: 'Password'
  end
  error code: 404, desc: MissingRecordDetection::Messages.not_found

  def create
    resource = warden.authenticate!(params[:staff])
    api_token = resource.api_tokens.create

    render json: { token: api_token.token }
  end

  api :DELETE, '/api_token/:id', 'Deletes api_token member with :id'
  param :id, String, required: true
  error code: 404, desc: MissingRecordDetection::Messages.not_found

  def destroy
    api_token = ApiToken.find_by_token!(params[:id])
    api_token.destroy
    head :ok
  end

  private

  def allow_params_authentication!
    request.env['devise.allow_params_authentication'] = true
  end
end
