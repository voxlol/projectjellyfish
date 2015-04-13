class GroupsController < ApplicationController
  api :POST, '/groups', 'Creates group'
  param :name, String, desc: 'Group Name', required: true
  param :description, String, desc: 'Group Description'
  param :staff_ids, Array
  error code: 422, desc: ParameterValidation::Messages.missing

  def create
    group = Group.create!(group_params)
    respond_with_params(group)
  end

  api :GET, '/groups', 'Returns a collection of groups'

  def index
    groups = Group.all
    respond_with_params groups
  end

  api :GET, '/groups/:id', 'Shows group with :id'
  param :id, :number, required: true
  error code: 404, desc: MissingRecordDetection::Messages.not_found

  def show
    group = Group.find(params[:id])
    respond_with_params group
  end

  api :PUT, '/groups/:id', 'Updates group with :id'
  param :id, :number, required: true
  param :name, String, desc: 'Group Name', required: true
  param :description, String, desc: 'Group Description'
  param :staff_ids, Array
  error code: 404, desc: MissingRecordDetection::Messages.not_found
  error code: 422, desc: ParameterValidation::Messages.missing

  def update
    group = Group.find(params[:id])
    group.update!(group_params)
    respond_with_params(group)
  end

  api :DELETE, '/groups/:id', 'Deletes group with :id'
  param :id, :number, required: true
  error code: 404, desc: MissingRecordDetection::Messages.not_found

  def destroy
    group = Group.find(params[:id])
    group.destroy
    respond_with_params(group)
  end

  api :POST, '/projects/:project_id/groups', 'Adds a user to the group'
  param :project_id, :number, required: true
  error code: 404, desc: MissingRecordDetection::Messages.not_found

  def join
    group = Group.find(params[:group_id])
    Project.find(params[:project_id]).groups << group
    head :ok
  end

  api :DELETE, '/projects/:project_id/groups/:group_id', 'Remove a user from a group'
  param :project_id, :number, required: true
  param :group_id, :number, required: true
  error code: 404, desc: MissingRecordDetection::Messages.not_found

  def leave
    group = Group.find(params[:group_id])
    Project.find(params[:project_id]).groups.delete(group)
    head :ok
  end

  private

  def group_params
    params.permit!.slice(:name, :description, :staff_ids)
  end
end
