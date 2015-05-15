require 'rails_helper'

RSpec.describe 'Memberships API' do
  let(:default_params) { { format: :json } }

  describe 'POST create' do
    it 'adds a user to a group' do
      sign_in_as create :staff, :admin
      group = create(:group)
      project = create(:project)

      post memberships_path(project, group_id: group.id)

      project.reload
      expect(response).to be_successful
      expect(project.groups).to include(group)
    end
  end

  describe 'DELETE destroy' do
    it 'removes a user from a group' do
      sign_in_as create :staff, :admin
      group = create(:group)
      project = create(:project, groups: [group])

      delete membership_path(project_id: project, group_id: group)

      project.reload
      expect(response).to be_successful
      expect(project.groups).not_to include(group)
    end

    it 'raises 404 when the group is not associated with the project' do
      sign_in_as create :staff, :admin
      group = create(:group)
      project = create(:project)

      delete membership_path(project_id: project, group_id: group)

      expect(response).to be_not_found
    end
  end
end
