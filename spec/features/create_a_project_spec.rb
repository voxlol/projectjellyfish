require 'rails_helper'

feature 'Project creation' do
  scenario 'staff creates a project', :js do
    staff = create(:staff)

    login_as(staff)

    visit '/project'
    find('#addNewProject span').click
    fill_in 'Name', with: 'Project Jellyfish'
    fill_in 'Icon', with: 'http://www.example.com/image.png'
    fill_in 'Budget', with: '$100,000'
    fill_in 'Start Date', with: '2020-01-01'
    fill_in 'End Date', with: '2020-12-01'
    find('a', text: 'CREATE').click

    expect(page).to have_content('Project created successfully.')
  end
end
