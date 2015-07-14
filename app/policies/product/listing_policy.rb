class Product
  class ListingPolicy < ApplicationPolicy
    def index?
      any_user!
    end

    def show?
      any_user!
    end
  end
end
