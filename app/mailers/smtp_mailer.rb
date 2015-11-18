class SMTPMailer < ActionMailer::Base
  default from: Setting[:smtp_default_sender]

  def project_create(project, recipient)
    set_smtp_settings
    @project = project
    @project_url = project_url(project)
    @recipient = (recipient.nil?) ? Setting[:smtp_default_recipient] : recipient
    mail(to: @recipient, template_path: 'smtp_mailer', subject: "Project Create Notification: #{project['name'].to_s.upcase}")
  end

  def project_create_admin(project)
    set_smtp_settings
    @project = project
    @project_url = project_url(project)
    @project_admins = Staff.admin.pluck(:email).join(', ')
    mail(to: @project_admins, template_path: 'smtp_mailer', subject: "Project Create Notification: #{project['name'].to_s.upcase}")
  end

  private

  def project_url(project)
    # TODO: FIGURE OUT BETTER WAY TO BUILD PROJECT URL
    (Rails.env != 'test') ? (Rails.application.routes.url_helpers.root_url + 'projects/' + project.id.to_s) : ('http://localhost:3000/projects/' + project.id.to_s)
  end

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
