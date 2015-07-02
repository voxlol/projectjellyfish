class MotdController < ApplicationController
  before_action :pre_hook
  after_action :verify_authorized
  after_action :post_hook

  def self.document_params
    param :message, String, desc: 'The message to of the day', required: true
  end

  api :GET, '/motd', 'Returns the MOTDs'
  def index
    respond_with_params motd
  end

  api :POST, '/motd', 'Create the MOTD'
  document_params

  def create
    motd = Motd.first_or_initialize motd_params
    authorize motd
    motd.save
    respond_with motd
  end

  api :PUT, '/motd', 'Update the MOTD'
  document_params

  def update
    respond_with_params motd.update_attributes motd_params
  end

  api :DELETE, '/motd', 'Destroy the MOTD'

  def destroy
    respond_with_params motd.destroy
  end

  private

  def motd_params
    params.permit(:message).merge(staff_id: current_user.id)
  end

  def motd
    @motd = Motd.first_or_initialize.tap { |r| authorize(r) }
  end
end
