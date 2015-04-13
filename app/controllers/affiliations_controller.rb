class AffiliationsController < ApplicationController
  api :POST, '/projects/:project_id/groups/:group_id', 'Add a group affiliation to a project'
  param :project_id, :number, 'ID of Project to add group affiliation to', required: true
  param :group_id, :number, 'ID of Group to affiliate with the project', required: true
  error code: 404, desc: MissingRecordDetection::Messages.not_found

  def create
    group = Group.find(params[:group_id])
    Project.find(params[:project_id]).groups << group
    head :ok
  end

  api :DELETE, '/projects/:project_id/groups/:group_id', 'Remove a group from a project'
  param :project_id, :number, required: true
  param :group_id, :number, required: true
  error code: 404, desc: MissingRecordDetection::Messages.not_found

  def destroy
    group = Group.find(params[:group_id])
    group.projects.delete(params[:project_id])
    head :ok
  end
end
