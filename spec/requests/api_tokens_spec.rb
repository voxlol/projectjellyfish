require 'rails_helper'

describe 'API Tokens API' do
  let(:default_params) { { format: :json } }
  let(:password) { 'test1234' }
  let(:email) { 'foo@bar.com' }

  describe 'POST create' do
    before :each do
      @staff_member = create :staff, :admin, email: email, password: password, password_confirmation: password
    end

    it 'creates a token for valid users', :show_in_doc do
      post '/api/v1/api_tokens.json', staff: { email: email, password: password }

      expect(response.code).to eq('200')
      expect(json['token']).to be_present
    end

    it 'does not create a token for invalid users', :show_in_doc do
      post '/api/v1/staff/sign_in.json', staff: { email: email, password: 'invalidpassword' }
      expect(response.code).to eq('401')
    end
  end

  describe 'DELETE destroy' do
    it 'deletes the token', :show_in_doc do
      create :staff, :admin, email: email, password: password, password_confirmation: password
      api_token = create(:api_token)

      delete "/api/v1/api_tokens/#{api_token.token}", nil, 'Authorization' => "token #{api_token.token}"

      expect(ApiToken.find_by_id(api_token.id)).to be_nil
    end
  end
end
