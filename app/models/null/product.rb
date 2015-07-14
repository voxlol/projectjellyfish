module Null
  class Product < ::Product
    def name
      'Null Product'
    end

    def service_class
      Null::Service
    end

    def listing_form
      []
    end

    def service_form
      []
    end
  end
end
