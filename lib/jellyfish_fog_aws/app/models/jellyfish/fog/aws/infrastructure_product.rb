module Jellyfish
  module Fog
    module AWS
      class InfrastructureProduct < ActiveRecord::Base
        def provisioner
          Jellyfish::Fog::AWS::Infrastructure
        end
      end
    end
  end
end
