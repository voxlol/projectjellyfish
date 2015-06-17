require 'rails_helper'

RSpec.describe 'Alerts API' do
  let(:default_params) { { format: :json } }

  describe 'GET index' do
    before :each do
      create :alert
      create :alert, :warning
      create :alert, :critical
      create :alert, :unknown
    end

    it 'returns a collection of all alerts', :show_in_doc do
      sign_in_as create :staff, :admin
      get '/api/v1/alerts'
      expect(json.length).to eq(4)
    end

    it 'paginates the alerts' do
      sign_in_as create :staff, :admin
      get '/api/v1/alerts', page: 1, per_page: 3
      expect(json.length).to eq(3)
    end

    it "returns a 401 error if the user isn't logged in" do
      @project = create :project
      get '/api/v1/alerts'
      expect(response).to be_unauthorized
    end
  end

  describe 'GET show (as Admin)' do
    #   before :each  do
    #     @active_alert = create :alert, :active, status: 'OK'
    #     create :alert, :inactive, status: 'OK'
    #     create :alert, :active, status: 'OK'
    #     create :alert, :active, status: 'WARNING'
    #     create :alert, :active, status: 'CRITICAL'
    #     create :alert, :inactive, status: 'OK'
    #     create :alert, :inactive, status: 'WARNING'
    #     create :alert, :inactive, status: 'CRITICAL'
    #     sign_in_as create :staff, :admin
    #   end
    #
    #   it 'retrieves alert by id', :show_in_doc do
    #     get "/api/v1/alerts/#{@active_alert.id}"
    #     expect(json['id']).to eq(@active_alert.id)
    #   end
    #
    #   it 'shows all alerts', :show_in_doc do
    #     get '/api/v1/alerts'
    #     expect(json.length).to eq(8)
    #   end
    #
    #   it 'shows all active alerts', :show_in_doc do
    #     get '/api/v1/alerts', active: true
    #     expect(json.length).to eq(4)
    #   end
    #
    #   it 'shows all inactive alerts', :show_in_doc do
    #     get '/api/v1/alerts', active: false
    #     expect(json.length).to eq(4)
    #   end
    #
    #   it 'shows all non-OK alerts', :show_in_doc do
    #     get '/api/v1/alerts', not_status: ['OK']
    #     expect(json.length).to eq(4)
    #   end
    #
    #   it 'shows all alerts sorted by oldest_first', :show_in_doc do
    #     get '/api/v1/alerts', sort: ['oldest_first']
    #     expect(json.length).to eq(8)
    #     expect(Time.zone.parse(json[0]['updated_at']).to_s).to eq(@active_alert.updated_at.to_s)
    #   end
    #
    #   it 'shows all active non-OK alerts', :show_in_doc do
    #     get '/api/v1/alerts', active: true, not_status: ['OK']
    #     expect(json.length).to eq(2)
    #   end
    #
    #   it 'returns an error when the alert does not exist' do
    #     get "/api/v1/alerts/#{@active_alert.id + 999}"
    #     expect(response.status).to eq(404)
    #     expect(json).to eq('error' => 'Not found.')
    #   end
    # end
    #
    # describe 'GET show (as Staff)' do
    #   it 'verifies show alerts, scoped to the user', :show_in_doc do
    #     project = create(:project)
    #     visible = create(:alert, :active, project: project)
    #     staff = create(:staff, alerts: [visible])
    #     staff.groups << Group.new(projects: [project])
    #     create(:alert, :active)
    #     sign_in_as staff
    #     get '/api/v1/alerts'
    #     data = JSON.parse(response.body)[0]
    #     expect(data['id']).to eq(visible.id)
    #     expect(data['project_id']).to eq(visible.project_id)
    #     expect(data['staff_id']).to eq(visible.staff_id)
    #     expect(data['order_item_id']).to eq(visible.order_item_id)
    #     expect(data['status']).to eq(visible.status)
    #     expect(data['message']).to eq(visible.message)
    #     # TODO: ALIGN THE FORMAT OF START AND END AGAINST THE JSON RETURNED BY ALERTS
    #     # expect(data['start_date']).to eq(visible.start_date)
    #     # expect(data['end_date']).to eq(visible.end_date)
    #   end
  end

  describe 'POST create' do
    before :each do
      sign_in_as create :staff, :admin
    end

    it 'creates a new project alert', :show_in_doc do
      alert = nil
      project = create(
        :project,
        alerts: [
          alert = create(:alert, :warning),
          alert2 = create(:alert, :critical),
          alert3 = create(:alert, :unknown)
        ]
      )
      get "/api/v1/projects/#{project.id}", includes: [:alerts]
      expect(json['alerts'].find { |v| v['id'] == alert.id }.to_json).to eq(alert.to_json)
      expect(json['alerts'].find { |v| v['id'] == alert2.id }.to_json).to eq(alert2.to_json)
      expect(json['alerts'].find { |v| v['id'] == alert3.id }.to_json).to eq(alert3.to_json)
    end

    it 'creates a new order item alert', :show_in_doc do
      alert = nil
      create(
        :project,
        services: [
          service = create(:order_item,
            alerts: [
              alert = create(:alert, :critical),
              alert2 = create(:alert, :critical),
              alert3 = create(:alert, :critical)
            ]
          )
        ]
      )
      get "/api/v1/order_items/#{service.id}", include: [:alerts]
      expect(json['alerts'].find { |v| v['id'] == alert.id }.to_json).to eq(alert.to_json)
      expect(json['alerts'].find { |v| v['id'] == alert2.id }.to_json).to eq(alert2.to_json)
      expect(json['alerts'].find { |v| v['id'] == alert3.id }.to_json).to eq(alert3.to_json)
      expect(json['id']).to eq(service.id)
    end
  end

  describe 'PUT update' do
    #   before :each do
    #     @alert = create :alert
    #     sign_in_as create :staff, :admin
    #   end
    #
    #   it 'changes existing alert message', :show_in_doc do
    #     params = {}
    #     params[:project_id] = @alert.project_id
    #     params[:staff_id] = @alert.staff_id
    #     params[:order_item_id] = @alert.order_item_id
    #     params[:status] = @alert.status
    #     params[:message] = 'Updated'
    #     put "/api/v1/alerts/#{@alert.id}", params
    #     expect(response.status).to eq(204)
    #   end
    #
    #   it 'returns an error when the setting does not exist' do
    #     put "/api/v1/alerts/#{@alert.id + 999}", message: 'Updated'
    #     expect(response.status).to eq(404)
    #     expect(json).to eq('error' => 'Not found.')
    #   end
  end

  describe 'DELETE destroy' do
    before :each do
      @alert = create :alert
      sign_in_as create :staff, :admin
    end

    it 'verifies alert no longer exists after delete', :show_in_doc do
      delete "/api/v1/alerts/#{@alert.id}"
      expect(response.status).to eq(204)
      get "/api/v1/alerts/#{@alert.id}"
      expect(json).to eq('error' => 'Not found.')
    end
  end
end
