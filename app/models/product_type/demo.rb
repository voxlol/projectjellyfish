class ProductType
  class Demo < ProductType
    def self.load_product_types
      return unless super
      transaction do
        [
          set('Demo Compute', '6e1c01ab-64e9-43b0-891f-5657170c845d', description: 'Demo Compute Product Type'),
          set('Demo Database', '398cbd70-0013-4222-b460-fdbd09656991', description: 'Demo Database Product Type'),
          set('Demo Storage', 'ec795ba0-b090-4f63-bdd6-13c7063d999d', description: 'Demo Storage Product Type')

        ].each { |s| create! s.merge!(type: 'ProductType::Demo') }
      end
    end
  end
end
