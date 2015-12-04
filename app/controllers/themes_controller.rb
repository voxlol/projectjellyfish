class ThemesController < ApplicationController
  after_action :verify_authorized

  api :GET, '/themes', 'Returns all themes.'

  def index
    authorize Theme
    respond_with_params themes
  end

  api :POST, '/themes', 'Creates a new theme'
  param :name, String, required: true, desc: 'Theme name'
  param :description, String, required: false, desc: 'A short description of the theme.'
  param :bg_color, String, required: true, desc: 'Main background color in 6-character hex (no #).'
  param :text_color, String, required: true, desc: 'Main text color in 6-character hex (no #).'
  error code: 422, desc: ParameterValidation::Messages.missing

  def create
    authorize Theme
    theme = Theme.create theme_params
    respond_with theme
  end

  private

  def themes
    @_themes ||= query_with Theme.all, :includes, :pagination
  end

  def theme_params
    params.permit(:name, :description, :bg_color, :text_color)
  end
end
