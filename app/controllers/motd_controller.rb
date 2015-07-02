class MotdController < ApplicationController
  def self.document_params(required: false)
    param :message, String, desc: 'The message to of the day', required: true
    param :staff_id, :number, required: true
  end

  api :GET, '/motd', 'Returns the all MOTDs'
  def index
    respond_with_params motds
  end

  api :GET, '/motd/:id', 'Returns MOTD with :id'
  param :id, :number, required: true
  error code: 404, desc: MissingRecordDetection::Messages.not_found

  def show
    respond_with motd
  end

  api :POST, '/motd', 'Create a MOTD'
  document_params required: true

  def create
    motd = Motd.new motd_params
    authorize motd
    motd.save
    respond_with motd
  end

  api :PUT, '/motd/:id', 'Update a MOTD'
  document_params

  def update
    respond_with_params motd.update_attributes motd_params
  end

  api :DELETE, '/motd/:id', 'Destroy a MOTD'
  def destroy
    respond_with_params motd.destroy
  end

  private

  def motd_params
    params.permit(:message, :staff_id)
  end

  def motd
    @motd = Motd.find(params.require(:id)).tap { |r| authorize(r) }
  end

  def motds
    authorize Motd
    @motds = Motd.all
  end
end
