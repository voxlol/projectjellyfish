class WizardQuestionsController < ApplicationController
  def first
    respond_with_params WizardQuestion.first
  end

  def show
    respond_with_params WizardQuestion.find(params[:id])
  end

  def create
    WizardQuestion.create(params_for_wizard_question)

    head :ok
  end

  def params_for_wizard_question
    params.require(:wizard_question).permit(:text)
  end
end
