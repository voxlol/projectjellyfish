module Jellyfish
  module Fog
    module AWS
      class DatabaseProduct < ActiveRecord::Base
        def provisioner
          Jellyfish::Fog::AWS::Databases
        end
      end
    end
  end
end
