module Jellyfish
  module Fog
    module AWS
      class StorageProduct < ActiveRecord::Base
        ORDER_QUESTIONS = {}.freeze

        def provisioner
          Jellyfish::Fog::AWS::Storage
        end
      end
    end
  end
end
