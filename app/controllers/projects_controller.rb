class ProjectsController < ApplicationController
  PROJECT_INCLUDES = %w(latest_alerts alerts approvals approvers memberships groups project_answers services staff orders)
  PROJECT_METHODS = %w(problem_count state state_ok)
  before_action :pre_hook
  after_action :verify_authorized
  after_action :post_hook

  has_scope :approved, type: :boolean
  has_scope :archived, type: :boolean

  def_param_group :project do
    param :name, String, action_aware: true
    param :budget, :decimal, precision: 12, scale: 2, action_aware: true
    param :description, String
    param :end_date, String, action_aware: true
    param :img, String
    param :answers, Array, desc: 'Project Specifications', action_aware: true do
      param :name, String, desc: 'Answer key'
      param :value_type, String, desc: 'How to interpret the :value'
    end
  end

  api :GET, '/projects', 'Returns a collection of projects'
  param :includes, Array, in: Project.reflect_on_all_associations.map(&:name).map(&:to_s)
  param :methods, Array, in: PROJECT_METHODS
  param :page, :number
  param :per_page, :number

  def index
    authorize Project
    respond_with_params projects
  end

  api :GET, '/projects/:id', 'Shows project with :id'
  param :id, :number, required: true
  param :includes, Array, in: Project.reflect_on_all_associations.map(&:name).map(&:to_s)
  param :methods, Array, in: PROJECT_METHODS
  error code: 404, desc: MissingRecordDetection::Messages.not_found

  def show
    authorize project
    respond_with_params project
  end

  api :POST, '/projects', 'Creates projects'
  param_group :project
  param :start_date, String, required: true
  error code: 422, desc: ParameterValidation::Messages.missing

  def create
    authorize Project
    #group_ids = current_user.admin? ? params[:group_ids] : params.require(:group_ids)
    project = Project.create project_params #.merge(group_ids: group_ids)
    respond_with_params project
  end

  api :PUT, '/projects/:id', 'Updates project with :id'
  param :id, :number, required: true
  param_group :project
  param :includes, Array, in: PROJECT_INCLUDES
  error code: 404, desc: MissingRecordDetection::Messages.not_found
  error code: 422, desc: ParameterValidation::Messages.missing

  def update
    authorize project
    group_ids = current_user.admin? ? params[:group_ids] : params.require(:group_ids)
    project.update project_params.merge(group_ids: group_ids)
    respond_with_params project
  end

  api :DELETE, '/projects/:id', 'Deletes project with :id'
  param :id, :number, required: true
  error code: 404, desc: MissingRecordDetection::Messages.not_found

  def destroy
    authorize project
    project.destroy
    respond_with project
  end

  private

  def project_params
    @_project_params ||= begin
      permitted = [
        :name, :description, :start_date, :end_date, :img,
        answers: [:id, :name, :value, :value_type],
        project_answers: [:project_question_id, :answer, :id]
      ]
      permitted << :budget if current_user.admin? || params[:id].nil?
      params.permit(permitted).tap do |project|
        project[:answers_attributes] = project.delete :answers
      end
    end
  end

  # def authorize_and_normalize(project)
  #   authorize project
  #   if render_params.fetch(:include, {})[:project_answers]
  #     render_params[:include][:project_answers][:include] = :project_question
  #   end
  # end

  # def build_empty_answers_to_questions(project)
  #   ProjectQuestion.where.not(id: project.project_answer_ids).each do |pq|
  #     project.project_answers.build(project_question: pq)
  #   end
  # end

  def projects
    @_projects ||= query_with apply_scopes(policy_scope(Project.all)), :includes, :pagination
  end

  def project
    @_project ||= Project.find(params[:id])
  end
end
