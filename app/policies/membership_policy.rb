class MembershipPolicy < ProjectPolicy
  def index?
    any_user!
  end

  def show?
    any_user!
  end

  def create?
    any_user!
  end

  def update?
    any_user!
  end

  def destroy?
    any_user!
  end
end
