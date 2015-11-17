include ActionView::Helpers

class SMTPMailer < ActionMailer::Base
  def project_create(_project, _recipients)
  end

  def order_create(_order, _recipients)
  end

  def project_approval_update(_project, _recipients)
  end
end
