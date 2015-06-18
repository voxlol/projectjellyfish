class RolesController < ApplicationController
  def self.document_params(required: false)
    param :name, String, desc: 'Name of the role', required: required
    param :description, String, desc: 'Description of the role', required: required
    param :permissions, Hash, desc: %(Hash of permissions allowed, such as { projects: ["read", "write"] }. Valid keys: #{Role::PERMISSIONS}.), required: required
  end

  api :GET, '/roles', 'Returns all roles'
  def index
    roles = Role.all
    authorize(roles)
    respond_with_params roles
  end

  api :GET, '/roles/:id', 'Returns roles with :id'
  param :id, :number, required: true
  error code: 404, desc: MissingRecordDetection::Messages.not_found

  def show
    role = Role.find(params[:id])
    authorize(role)
    respond_with role
  end

  api :POST, '/roles', 'Create a role'
  document_params required: true
  def create
    authorize(Role)
    respond_with_params Role.create!(role_params)
  end

  api :PUT, '/roles/:id', 'Update a role'
  document_params
  def update
    role = Role.find(params[:id])
    authorize(role)
    respond_with_params role.update!(role_params)
  end

  api :DELETE, '/roles/:id', 'Destroy a role'
  def destroy
    role = Role.find(params[:id])
    authorize(role)
    respond_with_params role.destroy
  end

  private

  def role_params
    params.permit(:name, :description, :permissions)
  end
end
