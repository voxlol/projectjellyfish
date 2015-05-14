module TokenAuthentication
  extend ActiveSupport::Concern

  # Please see https://gist.github.com/josevalim/fb706b1e933ef01e4fb6
  # before editing this file, the discussion is very interesting.

  included do
    private :authenticate_staff_from_token!

    before_action :authenticate_staff_from_token!
  end

  def authenticate_staff_from_token!
    token = ApiToken.find_by_token(token_from_header || params[:access_token])

    if token
      sign_in(token.staff, store: false)
    end
  end

  def token_from_header
    if request.headers['Authorization']
      request.headers['Authorization'].split(' ')[1]
    end
  end
end
