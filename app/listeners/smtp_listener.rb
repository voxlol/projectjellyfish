class SMTPListener
  def project_create(project, current_user)
    return nil unless smtp_enabled
    ProjectMailer.new_project_notification(project, current_user, 'current_user').deliver_later
    ProjectMailer.new_project_notification(project, current_user, 'admin').deliver_later
  end

  def smtp_enabled
    (Setting[:smtp_enabled].nil?) ? false : Setting[:smtp_enabled]
  end
end
