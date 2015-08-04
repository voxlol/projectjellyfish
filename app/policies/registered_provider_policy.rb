class RegisteredProviderPolicy < ApplicationPolicy
  def index?
    only_admins!
  end
end
