class Product
  class Listing < ActiveRecord::Base
    self.table_name = :product_listings

    acts_as_paranoid
    acts_as_taggable

    has_many :answers, as: :answerable
    has_many :orders

    enum status: { ok: 0, pending: 1, warning: 2, critical: 3, unknown: 4 }

    def product
      Product[product_type]
    end
  end
end
