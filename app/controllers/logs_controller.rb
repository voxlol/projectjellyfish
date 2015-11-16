class LogsController < ApplicationController
  def index
    respond_with_params logs
  end

  def create
    log = Log.create(log_params)
    respond_with log
  end

  private

  def log_params
    params.permit(:log_level, :message, :loggable_type, :loggable_id)
  end

  def logs
    @_logs ||= query_with Log.where(loggable_type: params[:loggable_type], loggable_id: params[:loggable_id]), :includes, :pagination
  end
end
