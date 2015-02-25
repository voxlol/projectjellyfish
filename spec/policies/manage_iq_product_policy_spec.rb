describe ManageIqProductPolicy do
  permissions :create? do
    it 'prevents creation if not an admin' do
      expect(ManageIqProductPolicy).not_to permit(current_staff)
    end
    it 'allows an admin to create clouds' do
      expect(ManageIqProductPolicy).to permit(admin)
    end
  end

  permissions :new? do
    it 'prevents creation if not an admin' do
      expect(ManageIqProductPolicy).not_to permit(current_staff)
    end
    it 'allows an admin to create clouds' do
      expect(ManageIqProductPolicy).to permit(admin)
    end
  end

  def admin
    create(:staff, :admin)
  end

  def current_staff
    create(:staff)
  end
end
