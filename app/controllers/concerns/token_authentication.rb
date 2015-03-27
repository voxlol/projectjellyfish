module TokenAuthentication
  extend ActiveSupport::Concern

  # Please see https://gist.github.com/josevalim/fb706b1e933ef01e4fb6
  # before editing this file, the discussion is very interesting.

  included do
    private :authenticate_staff_from_token!

    # This is our new function that comes before Devise's one
    before_action :authenticate_staff_from_token!

    # This is Devise's authentication
    # before_action :authenticate_staff!
  end

  # For this example, we are simply using token authentication
  # via parameters. However, anyone could use Rails's token
  # authentication features to get the token from a header.
  def authenticate_staff_from_token!
    user = Staff.find_by(email: request.headers['X-Staff-Email'], authentication_token: request.headers['X-Staff-Token'])
    return unless user.present?
    # Notice we are passing store false, so the user is not actually stored in the session and a token is needed for
    # every request. If you want the token to work as a sign in token, you can simply remove store: false.
    sign_in user, store: false
  end

  module ClassMethods
    # nop
  end
end
