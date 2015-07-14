class GroupPolicy < ApplicationPolicy
  def index?
    only_admins!
  end

  def show?
    only_admins!
  end

  def create?
    only_admins!
  end

  def update?
    only_admins!
  end

  def destroy?
    only_admins!
  end
end
