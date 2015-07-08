class MembershipsController < ApplicationController
  after_action :verify_authorized

  api :POST, '/projects/:project_id/groups', 'Add a group membership to a project'
  param :project_id, :number, 'ID of Project to add group membership to', required: true
  param :group_id, :number, 'ID of Group to associate with the project', required: true
  param :role_id, :number, 'ID of Role to associate with the group', required: true
  error code: 422, desc: ParameterValidation::Messages.missing
  error code: 404, desc: MissingRecordDetection::Messages.not_found

  def create
    membership = Membership.create membership_params
    authorize membership
    respond_with membership, location: project_memberships_url(membership.project, membership.group)
  end

  api :PUT, '/projects/:project_id/groups/:group_id', 'Update the role of a membership'
  param :project_id, :number, 'ID of Project to add group membership to', required: true
  param :group_id, :number, 'ID of Group to associate with the project', required: true
  param :role_id, :number, 'ID of Role', required: true
  error code: 422, desc: ParameterValidation::Messages.missing
  error code: 404, desc: MissingRecordDetection::Messages.not_found

  def update
    authorize membership
    membership.update! role: Role.find(params[:role_id])
    respond_with membership
  end

  api :DELETE, '/projects/:project_id/groups/:group_id', 'Remove a group from a project'
  param :project_id, :number, required: true
  param :group_id, :number, required: true
  error code: 422, desc: ParameterValidation::Messages.missing
  error code: 404, desc: MissingRecordDetection::Messages.not_found

  def destroy
    authorize membership
    membership.destroy
    respond_with membership
  end

  private

  def membership_params
    params.permit(:group_id, :project_id, :role_id)
  end

  def membership
    @membership ||= Membership.find_by! membership_params.except :role_id
  end
end
