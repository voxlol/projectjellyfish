describe MotdPolicy do
  subject { MotdPolicy }

  let(:user) { create :staff, :user }
  let(:admin) { create :staff, :admin }

  permissions :index? do
    it 'shows a collection of MOTDs for a user' do
      expect(subject).to permit(user)
    end

    it 'shows a collection of MOTDs for an admin' do
      expect(subject).to permit(admin)
    end
  end

  permissions :show? do
    it 'shows a MOTD for a user' do
      expect(subject).to permit(user)
    end

    it 'shows a MOTD for an admin' do
      expect(subject).to permit(admin)
    end
  end

  permissions :create? do
    it 'prevents creation of an MOTD for a user' do
      expect(subject).not_to permit(user)
    end

    it 'allows creation of an MOTD for an admin' do
      expect(subject).to permit(admin)
    end
  end

  permissions :update? do
    it 'prevents updates if not an admin' do
      expect(subject).not_to permit(user)
    end

    it 'allows an admin to make updates' do
      expect(subject).to permit(admin)
    end
  end

  permissions :destroy? do
    it 'prevents deleting if not an admin' do
      expect(subject).not_to permit(user)
    end
    it 'allows an admin to delete an MOTD' do
      expect(subject).to permit(admin)
    end
  end
end
