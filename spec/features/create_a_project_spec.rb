require 'rails_helper'

feature 'Project creation' do
  scenario 'staff creates a project', :js do
    visit root_path
    staff = create(:staff)

    fill_in 'email', with: staff.email
    fill_in 'password', with: staff.password
    click_on 'Login'
    click_on 'ADD NEW PROJECT'
    fill_in 'Name', with: 'Project Jellyfish'
    fill_in 'Icon', with: 'http://www.example.com/image.png'
    fill_in 'Budget', with: '$100,000'
    fill_in 'Start Date', with: '2015-01-01'
    fill_in 'End Date', with: '2016-01-01'
    find('a', text: 'CREATE').click

    expect(page).to have_content("Project created successfully.")
  end
end
