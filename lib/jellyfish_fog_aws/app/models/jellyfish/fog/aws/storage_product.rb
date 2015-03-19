module Jellyfish
  module Fog
    module AWS
      class StorageProduct < ActiveRecord::Base
        def provisioner
          Jellyfish::Fog::AWS::Storage
        end
      end
    end
  end
end
