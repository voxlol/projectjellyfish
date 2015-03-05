require 'rails_helper'

RSpec.describe 'Content Pages API' do
  let(:default_params) { { format: :json } }

  describe 'GET index' do
    before(:each) do
      create :content_page
      create :content_page
      sign_in_as create :staff, :admin
      @content_pages = ContentPage.all
    end

    it 'returns a collection of all of the content pages' do
      get '/content_pages'
      expect(response.body).to eq(@content_pages.to_json)
    end

    it 'paginates the content pages' do
      get '/content_pages', page: 1, per_page: 1
      expect(json.length).to eq(1)
    end
  end

  describe 'GET show' do
    before(:each) do
      create :content_page
      sign_in_as create :staff, :admin
      @content_page = ContentPage.first
    end

    it 'returns a content page', :show_in_doc do
      get "/content_pages/#{@content_page.slug}"
      expect(response.body).to eq(@content_page.to_json)
    end

    it 'returns an error when the content page does not exist' do
      get '/content_pages/this-slug-does-not-exist'
      expect(response.status).to eq(404)
      expect(JSON(response.body)).to eq('error' => 'Not found.')
    end
  end

  describe 'PUT update' do
    before(:each) do
      create :content_page
      sign_in_as create :staff, :admin
      @content_page = ContentPage.first
    end

    it 'updates a content page', :show_in_doc do
      put "/content_pages/#{@content_page.slug}", body: 'test'
      expect(response.status).to eq(204)
    end

    it 'returns an error when the content page does not exist' do
      put '/content_pages/this-slug-does-not-exist', body: 'test'
      expect(response.status).to eq(404)
      expect(JSON(response.body)).to eq('error' => 'Not found.')
    end
  end

  describe 'POST create' do
    before(:each) do
      sign_in_as create :staff, :admin
    end

    it 'creates an content page', :show_in_doc do
      post '/content_pages/', title: 'test'
      expect(response.body).to eq(ContentPage.first.to_json)
    end
  end

  describe 'DELETE destroy' do
    before :each do
      sign_in_as create :staff, :admin
      @content_page = create :content_page
    end

    it 'removes the content page', :show_in_doc do
      delete "/content_pages/#{@content_page.slug}"
      expect(response.status).to eq(204)
    end

    it 'returns an error when the content page does not exist' do
      delete '/content_pages/this-slug-does-not-exist'
      expect(response.status).to eq(404)
      expect(JSON(response.body)).to eq('error' => 'Not found.')
    end
  end
end
