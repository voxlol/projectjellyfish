class SettingPolicy < ApplicationPolicy
  def index?
    true
  end

  def update?
    only_admins!
  end

  class Scope < Scope
    def resolve
      scope
    end
  end
end
