class MotdPolicy < ApplicationPolicy
  # def initialize(user, record); end

  # def show?
  #   true
  # end

  def create?
    user.admin?
  end

  def update?
    user.admin?
  end

  def destroy?
    user.admin?
  end

  class Scope < Scope
    def resolve
      scope
    end
  end
end
