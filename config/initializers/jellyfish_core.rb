# We may be executing something like rake db:migrate:reset, which destroys this table
# only continue if the table exists
begin
  if Setting.table_exists?
    # in this phase, the classes are not fully loaded yet, load them
    Dir[Rails.root.join 'app', 'models', 'setting', '*.rb'].each do |f|
      require_dependency(f)
    end

    Setting.descendants.each(&:load_defaults)
  end
rescue
  false
end
