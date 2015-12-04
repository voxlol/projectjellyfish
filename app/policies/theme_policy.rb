class ThemePolicy < ApplicationPolicy
  def show?
    true
  end

  def create?
    admin?
  end

  def update?
    admin?
  end
end
