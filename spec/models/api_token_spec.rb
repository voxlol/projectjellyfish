require 'rails_helper'

describe 'ApiToken#create' do
  it 'sets the token to a randomly generated string' do
    api_token = create(:api_token)

    expect(api_token.token.length).to eq(16)
  end
end
