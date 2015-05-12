require 'rails_helper'

describe 'WizardQuestions API' do
  describe 'GET show' do
    it 'returns the wizard question' do
      sign_in_as create :staff, :admin
      answer = create(
        :wizard_answer,
        text: 'PHP',
        tags_to_add: %w(PHP Linux),
        tags_to_remove: %w(Windows Java Ruby dotNet)
      )
      question = create(
        :wizard_question,
        text: 'What programming language will be used?',
        wizard_answers: [answer]
        )
      next_question = create(:wizard_question)

      get "/api/v1/wizard_questions/#{question.id}", includes: %w(wizard_answers)

      expect(json).to include({
        text: 'What programming language will be used?',
        next_question_id: next_question.id,
        wizard_answers:
          [
            {
              text: 'PHP',
              tags_to_add: %w(PHP Linux),
              tags_to_remove: %w(Windows Java Ruby dotNet)
            }
          ]
      }.deep_stringify_keys
      )
    end
  end

  describe 'GET first' do
    it 'returns the first question' do
      first_question = create(:wizard_question)
      _second_question = create(:wizard_question)
      sign_in_as create :staff, :admin

      get '/api/v1/wizard_questions/first', includes: %w(wizard_answers)

      expect(json['id']).to eq first_question.id
    end
  end

  describe 'POST create' do
    it 'creates a wizard question' do
      sign_in_as create :staff, :admin

      post '/api/v1/wizard_questions', text: 'Test question?'

      last_wizard_question = WizardQuestion.last
      expect(last_wizard_question.text).to eq('Test question?')
    end
  end
end
