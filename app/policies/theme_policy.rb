class ThemePolicy < ApplicationPolicy
  def index?
    true
  end

  def create?
    admin?
  end
end
