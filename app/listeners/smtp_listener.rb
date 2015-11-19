class SMTPListener
  def project_create(project, recipient)
    return nil unless smtp_enabled
    ProjectMailer.new_project_notification(project, recipient).deliver_later
    ProjectMailer.admin_project_approval_reminder(project).deliver_later
  end

  def smtp_enabled
    (Setting[:smtp_enabled].nil?) ? false : Setting[:smtp_enabled]
  end
end
