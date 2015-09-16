class VersionsController < ApplicationController
  skip_before_action :require_user, only: [:show]
  after_action :verify_authorized, except: [:show]

  def self.error_codes
    error code: 404, desc: MissingRecordDetection::Messages.not_found
    error code: 422, desc: ParameterValidation::Messages.missing
  end

  def self.document_params
    param :message, String, desc: 'Return various meta data about the app', required: true
    error_codes
  end

  api :GET, '/version', 'Returns the current version of the app'
  error_codes

  def show
    message = {}
    message['jellyfish_version'] = File.read('VERSION').strip
    respond_with message.to_json
  end
end
