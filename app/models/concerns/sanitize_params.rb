module SanitizeParams
  extend ActiveSupport::Concern

  protected

  def strip_tags(params)
    stripped_params = { staff_id: current_user.id }
    params.each do |k, v|
      if v.is_a? String
        stripped_params[k.to_sym] = ActionController::Base.helpers.strip_tags(v)
      else
        stripped_params[k.to_sym] = v
      end
    end
    ActionController::Parameters.new(stripped_params)
  end
end
