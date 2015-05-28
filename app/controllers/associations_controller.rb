class AssociationsController < ApplicationController
  api :POST, '/groups/:group_id/staff/:staff_id', 'Add staff to a group'
  param :group_id, :number, required: true, desc: 'ID of group to add staff to'
  param :staff_id, :number, required: true, desc: 'ID of staff to add to group'
  def create
    Group.find(params[:group_id]).staff << Staff.find(params[:staff_id])
    head :ok
  end

  api :DELETE, '/groups/:group_id/staff/:staff_id', 'Remove staff from a group'
  param :group_id, :number, required: true, desc: 'ID of group to add staff to'
  param :staff_id, :number, required: true, desc: 'ID of staff to add to group'
  def destroy
    Group.find(params[:group_id]).staff.delete(params[:staff_id])
    head :ok
  end
end
