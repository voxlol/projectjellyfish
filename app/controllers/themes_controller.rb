class ThemesController < ApplicationController
  skip_before_action :require_user, only: [:show]
  after_action :verify_authorized, except: [:show]

  def_param_group :theme_params do
    param :name, String, required: true, desc: 'Name of the theme.'
    param :description, String, required: false, desc: 'A short description of the theme.'
    param :colors, Hash, required: true, desc: 'Color configuration in a JSON format.'
    error_codes
  end

  api :GET, '/themes', 'Returns the site theme.'
  error code: 404, desc: MissingRecordDetection::Messages.not_found
  error code: 422, desc: ParameterValidation::Messages.missing

  def show
    respond_with_params Theme.first
  end

  api :POST, '/themes', 'Create new site theme.'
  param_group :theme_params

  def create
    theme_create_or_update
  end

  api :PUT, '/themes', 'Updates existing site theme.'
  param_group :theme_params

  def update
    theme_create_or_update
  end

  private

  def theme_create_or_update
    authorize theme
    theme.update theme_params
    respond_with_params theme
  end

  def theme_params
    params.permit(:name, :description, :colors)
  end

  def theme
    @_theme ||= Theme.first_or_initialize
  end
end
