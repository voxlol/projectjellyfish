class SMTPListener
  def project_create(project, recipient)
    SMTPMailer.project_create(project, recipient).deliver_later if smtp_enabled
    SMTPMailer.project_create_admin(project).deliver_later if smtp_enabled
  end

  def smtp_enabled
    (Setting[:smtp_enabled].nil?) ? false : Setting[:smtp_enabled]
  end
end
