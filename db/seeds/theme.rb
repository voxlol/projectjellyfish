default_theme_data = YAML.load_file(File.join [Rails.root, 'db', 'data', 'sample', 'themes.yml'])
Theme.create(default_theme_data)
