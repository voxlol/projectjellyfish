require 'rails_helper'

feature 'Staff signs in' do
  scenario 'normal staff successfully signs in with email and password', :js do
    visit root_path
    staff = create(:staff)

    fill_in 'email', with: staff.email
    fill_in 'password', with: staff.password
    click_on 'Login'

    expect(#"currentUser").to have_content("#{staff.first_name} #{staff.last_name}")
  end
end
