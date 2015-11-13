class LogsController < ApplicationController
  skip_before_filter :require_user
  def index
    respond_with_params logs
  end

  def logs
    @_logs ||= query_with Log.where(loggable_type: params[:loggable_type], loggable_id: params[:loggable_id]), :includes, :pagination
  end
end