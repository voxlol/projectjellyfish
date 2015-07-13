class Product
  class Listing < ActiveRecord::Base
    acts_as_paranoid
    acts_as_taggable

    belongs_to :product
  end
end
