require 'spec_helper'

describe 'Associations API' do
  describe 'POST create' do
    it 'adds a user to a group' do
      sign_in_as create(:staff, :admin)
      group = create(:group)
      staff = create(:staff)

      post group_association_path(group, staff)

      expect(response).to be_success
      expect(group.staff).to eq [staff]
    end
  end

  describe 'DELETE destroy' do
    it 'removes a staff from a group' do
      sign_in_as create(:staff, :admin)
      staff = create(:staff)
      group = create(:group, staff: [staff])

      delete group_association_path(group, staff)

      expect(response).to be_success
      expect(group.reload.staff).to eq []
    end

    it '404s if the staff was not on the group' do
      sign_in_as create(:staff, :admin)
      staff = create(:staff)
      group = create(:group)

      delete group_association_path(group, staff)

      expect(response).to be_not_found
    end
  end
end
