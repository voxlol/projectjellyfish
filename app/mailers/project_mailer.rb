class ProjectMailer < ActionMailer::Base
  default from: Setting[:smtp_default_sender]

  def new_project_notification(project, current_user, mode)
    set_smtp_settings
    case mode
    when 'current_user'
      @recipient = current_user.email
      @subject = "Project Create Notification: #{project['name'].to_s.upcase}"
      @salutation = 'Dear User,'
      @direction = 'Please wait for admin approval before using the project.'
    when 'admin'
      @recipient = Staff.admin.pluck(:email).join(', ')
      @subject = "Project Approval Needed: #{project['name'].to_s.upcase}"
      @salutation = 'Dear Admin,'
      @direction = 'Please navigate to the project and approve it at your discretion.'
    else
      return nil
    end
    @project = project
    @project_url = project_url(project)
    mail(to: @recipient, subject: @subject)
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
