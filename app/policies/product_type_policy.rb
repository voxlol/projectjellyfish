class ProductTypePolicy < ApplicationPolicy
  def index?
    any_user!
  end

  def show?
    any_user!
  end
end
