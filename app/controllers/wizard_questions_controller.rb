class WizardQuestionsController < ApplicationController
  api :GET, '/wizard_questions', 'List all wizard questions with answers'
  param :includes, Array, in: ['wizard_answers']

  def index
    respond_with_params WizardQuestion.all
  end

  api :GET, '/wizard_questions/first', 'Return first question'
  param :includes, Array, in: ['wizard_answers']
  error code: 404, desc: MissingRecordDetection::Messages.not_found

  def first
    respond_with_params WizardQuestion.first
  end

  api :GET, '/wizard_questions/:id', 'Shows question with :id'
  param :id, :number, required: true
  param :includes, Array, in: ['wizard_answers']
  error code: 404, desc: MissingRecordDetection::Messages.not_found

  def show
    respond_with_params WizardQuestion.find(params[:id])
  end

  api :POST, '/wizard_questions', 'Create a wizard question'
  param :text, String, desc: 'Question text', required: true
  error code: 422, desc: ParameterValidation::Messages.missing

  def create
    WizardQuestion.create(wizard_question_params)

    head :ok
  end

  private

  def wizard_question_params
    params.permit(:text)
  end
end
