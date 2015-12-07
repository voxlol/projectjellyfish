require 'rails_helper'

describe 'theme API' do
  let(:default_params) { { format: :json } }

  describe 'GET show' do
    let(:theme) { create :theme }

    it 'returns the theme for an admin' do
      sign_in_as create(:staff, :admin)

      get theme_path

      expect(response.body).to eq(Theme.first.to_json)
    end

    it 'returns a the theme for a user' do
      sign_in_as create(:staff, :user)

      get theme_path

      expect(response.body).to eq(Theme.first.to_json)
    end

    it 'returns a the theme for a guest' do
      get theme_path

      expect(response.body).to eq(Theme.first.to_json)
    end
  end

  describe 'POST create' do
    it 'allows creation of an theme for an admin' do
      sign_in_as create(:staff, :admin)

      post theme_path, name: 'Test theme', description: 'Description of the theme', config: { bg: '#000000' }

      expect(response.body).to eq(Theme.first.to_json)
    end

    it 'prevents creation of an theme for a user' do
      sign_in_as create(:staff, :user)

      post theme_path, name: 'Test theme', description: 'Description of the theme', config: { bg: '#000000' }

      expect(response.status).to eq(403)
    end

    it 'prevents creation of an theme for a guest' do
      post theme_path, name: 'Test theme', description: 'Description of the theme', config: { bg: '#000000' }

      expect(response.status).to eq(401)
    end
  end

  describe 'PUT update' do
    it 'allows an admin to make updates' do
      sign_in_as create(:staff, :admin)

      put theme_path, name: 'Test theme', description: 'Description of the theme', config: { bg: '#000000' }

      expect(response.status).to eq(204)
    end

    it 'prevents updates for a user' do
      sign_in_as create(:staff, :user)

      put theme_path, name: 'Test theme', description: 'Description of the theme', config: { bg: '#000000' }

      expect(response.status).to eq(403)
    end

    it 'prevents updates for a guest' do
      put theme_path, name: 'Test theme', description: 'Description of the theme', config: { bg: '#000000' }

      expect(response.status).to eq(401)
    end
  end
end
