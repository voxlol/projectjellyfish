require 'rails_helper'

describe ApplicationController, type: :controller do
  let(:default_params) { { format: :json } }

  controller do
    def index; end
  end

  describe 'user authentication' do
    it "returns a 401 if the user isn't logged in" do
      get :index

      expect(response).to be_unauthorized
    end
  end
end
