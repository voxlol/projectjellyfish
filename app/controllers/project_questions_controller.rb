class ProjectQuestionsController < ApplicationController
  after_action :verify_authorized

  def self.option_params
    param :options, Array, desc: 'Options', allow_nil: true do
      param :option, String, desc: 'Option label'
      param :position, :number, 'Load order'
      param :exclude, Array, 'Exclude tags', allow_nil: true
      param :include, Array, 'Include tags', allow_nil: true
    end
  end

  api :GET, '/project_questions', 'Returns a collection of project_questions'
  param :page, :number, required: false
  param :per_page, :number, required: false
  param :includes, Array, required: false, in: %w(project)

  def index
    respond_with_params project_questions
  end

  api :GET, '/project_questions/:id', 'Shows project_question with :id'
  param :id, :number, required: true
  param :includes, Array, required: false, in: %w(project)
  error code: 404, desc: MissingRecordDetection::Messages.not_found

  def show
    respond_with_params project_question
  end

  api :POST, '/project_questions', 'Creates project_question'
  param :question, String, desc: 'Question'
  param :field_type, String, desc: 'Field Type', in: ProjectQuestion.field_types.keys
  param :help_text, String, desc: 'Help Text'
  param :position, :number, desc: 'Load order'
  option_params
  param :required, :bool, desc: 'Required?'
  error code: 422, desc: ParameterValidation::Messages.missing

  def create
    authorize ProjectQuestion
    respond_with ProjectQuestion.create project_question_params
  end

  api :PUT, '/project_questions/:id', 'Updates project_question with :id'
  param :id, :number, required: true
  param :question, String, desc: 'Question'
  param :field_type, String, desc: 'Field Type', in: ProjectQuestion.field_types.keys
  param :help_text, String, desc: 'Help Text'
  param :position, :number, desc: 'Load order'
  option_params
  param :required, :bool, desc: 'Required', allow_nil: true
  error code: 404, desc: MissingRecordDetection::Messages.not_found
  error code: 422, desc: ParameterValidation::Messages.missing

  def update
    respond_with project_question.update_attributes project_question_params
  end

  api :DELETE, '/project_questions/:id', 'Deletes project_question with :id'
  param :id, :number, required: true
  error code: 404, desc: MissingRecordDetection::Messages.not_found

  def destroy
    respond_with project_question
  end

  api :PUT, '/project_questions/:id/reposition', 'Repositions the project question'
  param :id, :number, required: true
  param :position, :number, required: true
  error code: 404, desc: MissingRecordDetection::Messages.not_found

  def reposition
    project_question.insert_at project_question_params[:position]
    respond_with project_question
  end

  private

  def project_question_params
    params.permit(:uuid, :question, :field_type, :help_text, :required, :position, options: [:option, :position, exclude: [], include: []])
  end

  def project_question
    @project_question = ProjectQuestion.find(params.require(:id)).tap { |q| authorize q }
  end

  def project_questions
    @project_questions ||= begin
      authorize ProjectQuestion
      query_with ProjectQuestion.ordered, :includes, :pagination
    end
  end
end
