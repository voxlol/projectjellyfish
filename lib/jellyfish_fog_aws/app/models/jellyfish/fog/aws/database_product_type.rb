module Jellyfish
  module Fog
    module AWS
      class DatabaseProductType
        DESCRIPTION = 'Databases'.freeze
        PRODUCT_CLASS = DatabaseProduct
        PRODUCT_QUESTIONS = JSON.parse(
          File.read(
            Jellyfish::Fog::AWS::Engine.root.join(
              *%w(config product_questions database.json)
            )
          )
        ).freeze

        def self.description
          DESCRIPTION
        end

        def self.product_questions
          PRODUCT_QUESTIONS
        end

        def self.as_json(*)
          { DESCRIPTION => PRODUCT_QUESTIONS }
        end
      end
    end
  end
end
