describe ProductPolicy do
  permissions :index? do
    it 'allows access for a user' do
      expect(ProductPolicy).to permit(current_staff)
    end
  end

  permissions :show? do
    it 'allows access for a user' do
      expect(ProductPolicy).to permit(current_staff)
    end
  end

  permissions :answers? do
    it 'allows access for a user' do
      expect(ProductPolicy).to permit(current_staff)
    end
  end

  permissions :destroy? do
    it 'prevents creation if not an admin' do
      expect(ProductPolicy).not_to permit(current_staff)
    end
    it 'allows an admin to create clouds' do
      expect(ProductPolicy).to permit(admin)
    end
  end

  def admin
    create(:staff, :admin)
  end

  def current_staff
    create(:staff)
  end
end
