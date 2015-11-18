class SMTPListener
  def project_create(project, current_user)
    SMTPMailer.project_create(project, current_user).deliver_later if smtp_enabled
  end

  def order_create(_order, _current_user)
    return nil unless smtp_enabled
  end

  def project_approval_update(_project)
    return nil unless smtp_enabled
  end

  def smtp_enabled
    @smtp_enabled ||= (Setting[:smtp_enabled].nil?) ? false : Setting[:smtp_enabled]
  end
end
