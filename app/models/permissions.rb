class Permissions
  def initialize(user:, object:)
    @model_type = table_name(object)
    @project_id = project(object)
    @user = user
  end

  def allow?(action)
    @user.roles
      .joins(:projects)
      .where('projects.id' => @project_id)
      .where('permissions->:model_type ? :permission',
        model_type: @model_type,
        permission: action)
      .exists?
  end

  private

  def project(project_or_related)
    if project_or_related.is_a?(Project)
      project_or_related.id
    elsif project_or_related.respond_to?(:project_id)
      project_or_related.project_id
    else
      fail ArgumentError, "#{project_or_related.model_name} is not related to project."
    end
  end

  def table_name(object)
    if object.respond_to?(:table_name)
      object.table_name
    elsif object.class.respond_to?(:table_name)
      object.class.table_name
    else
      fail ArgumentError, "#{object.inspect} or its singleton class do not define `table_name`."
    end
  end
end
