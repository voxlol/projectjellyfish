require 'rails_helper'

describe 'theme API' do
  let(:default_params) { { format: :json } }
  let(:theme) { create :theme }

  describe 'GET show' do
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

  describe 'PUT update' do
    before(:each) do
      @theme = create :theme
      @params = {
        name: 'Theme name',
        description: 'Theme description',
        config: {
          global: ['mock'],
          link: ['mock'],
          button: ['mock'],
          navigation: ['mock'],
          region: ['mock'],
          tables: ['mock'],
          tags: ['mock'],
          modal: ['mock']
        }
      }
    end

    it 'allows an admin to make updates' do
      sign_in_as create(:staff, :admin)

      put theme_path, @params

      expect(response.status).to eq(204)
    end

    it 'prevents updates for a user' do
      sign_in_as create(:staff, :user)

      put theme_path, @params

      expect(response.status).to eq(403)
    end

    it 'prevents updates for a guest' do
      put theme_path, @params
      expect(response.status).to eq(401)
    end
  end
end
