describe ProjectPolicy do
  subject { ProjectPolicy }

  permissions :index? do
    it 'allows access for a user' do
      expect(subject).to permit(build_stubbed(:staff))
    end
    it 'allows access for an admin' do
      expect(subject).to permit(build_stubbed(:staff, :admin))
    end
  end

  permissions :show? do
    it 'prevents unassociated users from viewing projects' do
      expect(subject).not_to permit(build_stubbed(:staff), build_stubbed(:project))
    end

    it 'allows you to see your projects' do
      staff = create(:staff)
      project = create(:project)
      staff.groups.create(projects: [project])

      expect(subject).to permit(staff, staff.projects.first)
    end
    it 'allows an admin to see any project' do
      expect(subject).to permit(build_stubbed(:staff, :admin), build_stubbed(:project))
    end
  end

  permissions :create? do
    it 'prevents user without group' do
      expect(subject).not_to permit(build_stubbed(:staff))
    end

    it 'allows creation if staff belongs to at least one group' do
      staff = build_stubbed(:staff)
      staff.groups.build

      expect(subject).to permit(staff)
    end

    it 'allows an admin without a group to build_stubbed projects' do
      expect(subject).to permit(build_stubbed(:staff, :admin))
    end
  end

  permissions :update? do
    it 'prevents updates if not an associated user' do
      expect(subject).not_to permit(build_stubbed(:staff), build_stubbed(:project))
    end

    it 'allows you to update your projects' do
      staff = create(:staff)
      project = create(:project)
      staff.groups.create(projects: [project])

      expect(subject).to permit(staff, staff.projects.first)
    end

    it 'allows an admin to make updates' do
      expect(subject).to permit(build_stubbed(:staff, :admin), build_stubbed(:project))
    end
  end

  permissions :destroy? do
    it 'prevents an unassociated user from deleting a project' do
      expect(subject).not_to permit(build_stubbed(:staff), build_stubbed(:project))
    end
    it 'allows you to delete your projects' do
      staff = create(:staff)
      project = create(:project)
      staff.groups.create(projects: [project])

      expect(subject).to permit(staff, staff.projects.first)
    end
    it 'allows an admin to delete any project' do
      expect(subject).to permit(build_stubbed(:staff, :admin), build_stubbed(:project))
    end
  end
end
