class ProductInstancePolicy < ApplicationPolicy
  # TODO True for the moment; Apply actual policies before commit
  def show?
    true
  end

  def create?
    true
  end

  def update?
    true
  end
end
