require 'rails_helper'

feature 'Stack wizard' do
  scenario 'user edits the Wizard', :js do
    staff = create(:staff, :admin)
    login_as(staff)

    visit '/admin/wizard'

    fill_in 'Question', with: 'What programming language will be used?'
    fill_in 'Answer', with: 'PHP'
    fill_in 'Tags to Add', with: 'PHP'
    fill_in 'Tags to Remove', with: 'Ruby'

    find('a', text: 'Save Question and Add Another').click

    visit '/admin/wizard'
    id = WizardQuestion.last.id

    expect(page.find("#question_#{id}").value).to eq 'What programming language will be used?'
    expect(page.find("#question_#{id}_answer_0").value).to eq 'PHP'
    expect(page.find("#question_#{id}_answer_0_tags_to_add").value).to eq 'PHP'
    expect(page.find("#question_#{id}_answer_0_tags_to_remove").value).to eq 'Ruby'
  end
end
