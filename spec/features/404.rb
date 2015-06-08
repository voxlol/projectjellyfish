require 'rails_helper'

feature 'Checks if page exists', js: true do
  scenario 'gives a 404 if the page does not exist' do
    visit '/this_page_does_not_exist'
    expect(page).to have_selector('.four0four')
  end

  scenario 'does not give a 404 if the page does not exist' do
    visit '/'
    expect(page).should_not have_selector('.four0four')
  end
end

