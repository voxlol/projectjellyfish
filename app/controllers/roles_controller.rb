class RolesController < ApplicationController
  def self.document_params(required: false)
    param :name, String, desc: 'Name of the role', required: required
    param :description, String, desc: 'Description of the role', required: required
    param :permissions, Hash, desc: %(Hash of permissions allowed, such as { projects: ["read", "write"] }. Valid keys: #{Role::PERMISSIONS}.), required: required
  end

  api :GET, '/roles', 'Returns all roles'
  def index
    respond_with_params load_roles
  end

  api :GET, '/roles/:id', 'Returns roles with :id'
  param :id, :number, required: true
  error code: 404, desc: MissingRecordDetection::Messages.not_found

  def show
    respond_with_params load_role
  end

  api :POST, '/roles', 'Create a role'
  document_params required: true

  def create
    authorize(Role)
    respond_with Role.create!(role_params)
  end

  api :PUT, '/roles/:id', 'Update a role'
  document_params

  def update
    respond_with_params load_role.update!(role_params)
  end

  api :DELETE, '/roles/:id', 'Destroy a role'
  def destroy
    respond_with_params load_role.destroy
  end

  private

  def role_params
    params.permit(:name, :description, :permissions)
  end

  def load_role
    @role = Role.find(params.require(:id)).tap { |r| authorize(r) }
  end

  def load_roles
    authorize Role
    @roles = Role.all
  end
end
