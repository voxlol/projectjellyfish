class OrderPolicy < ApplicationPolicy
  def index?
    any_user!
  end

  def show?
    any_user!
  end

  def create?
    any_user!
  end
end
