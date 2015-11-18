class SMTPMailer < ActionMailer::Base
  default from: Setting[:smtp_default_sender]
  default to: Setting[:smtp_default_recipient]

  def project_create(project, _current_user)
    set_smtp_settings
    @project = project
    # TODO: FIGURE OUT MORE CONVENTION FRIENDLY WAY TO GET PROJECT URL
    @project_url = (Rails.env != 'test') ? (Rails.application.routes.url_helpers.root_url + 'projects/' + project.id.to_s) : ('http://localhost:3000/api/v1/projects/' + project.id.to_s)
    mail(template_path: 'smtp_mailer', subject: "Project Create Notification: #{project['name'].to_s.upcase}")
  end

  def order_create(_order, _recipients)
  end

  def project_approval_update(_project, _recipients)
  end

  private

  def set_smtp_settings
    # TODO: REFACTOR TO ONLY RUN ONCE THE FIRST TIME ITS CALLED
    # SINCE ACTION MAILER WILL INITIALIZE WITH DEMO SMTP SETTINGS
    # WE NEED TO RUN THIS TO APPLY ACTUAL CREDENTIALS TO SEND MAIL
    ActionMailer::Base.smtp_settings = {
      address:              Setting[:smtp_address],
      port:                 Setting[:smtp_port],
      user_name:            Setting[:smtp_user_name],
      password:             Setting[:smtp_password],
      authentication:       Setting[:smtp_authentication],
      enable_starttls_auto: Setting[:smtp_enable_starttls_auto]
    }
  end
end
