def sample_data(file)
  data = YAML.load_file(File.join [Rails.root, 'db', 'data', 'sample', [file, 'yml'].join('.')])
  return data unless block_given?
  data.each { |d| yield d }
end


namespace :sample do
  desc 'Reset Auto Increment Ids'
  task reset: :environment do
    Alert.connection.execute('ALTER SEQUENCE alerts_id_seq RESTART 1')
    Order.connection.execute('ALTER SEQUENCE orders_id_seq RESTART 1')
    OrderItem.connection.execute('ALTER SEQUENCE order_items_id_seq RESTART 1')
    Project.connection.execute('ALTER SEQUENCE projects_id_seq RESTART 1')
    Product.connection.execute('ALTER SEQUENCE products_id_seq RESTART 1')
    Staff.connection.execute('ALTER SEQUENCE staff_id_seq RESTART 1')
  end

  desc 'Generates demo data'
  task demo: :environment do
    orgs = sample_data('organizations').map do |data|
      alerts = data.delete 'alerts'
      [data.delete('_assoc'), Organization.create(data).tap do |org|
          org.alerts.create(alerts) unless alerts.nil?
        end]
    end

    users = sample_data('staff').map do |data|
      alerts = data.delete 'alerts'
      [data.delete('_assoc'), Staff.create(data).tap do |user|
          user.alerts.create(alerts) unless alerts.nil?
        end]
    end

    clouds = sample_data('clouds').map do |data|
      [data.delete('_assoc'), Cloud.create(data)]
    end

    categories = sample_data('product_categories').map do |data|
      [data.delete('_assoc'), ProductCategory.create(data)]
    end

    product_types = sample_data('product_types').map do |data|
      cloud = clouds.assoc(data.delete 'cloud').last
      [data.delete('_assoc'), ProductType.create(data.merge cloud: cloud)]
    end

    products = sample_data('products').map do |data|
      product_type = product_types.assoc(data.delete 'product_type').last
      [data.delete('_assoc'), Product.create(data.merge product_type: product_type)]
    end

    project_questions = sample_data('project_questions').map do |data|
      [data.delete('_assoc'), ProjectQuestion.create(data)]
    end

    projects = sample_data('projects').map do |data|
      approvals = data.delete 'approvals'
      alerts = data.delete 'alerts'
      answers = data.delete 'project_answers'
      [data.delete('_assoc'), Project.create(data).tap do |project|
          project.alerts.create(alerts) unless alerts.nil?
          unless approvals.nil?
            approvals = approvals.map do |approval|
              user = users.assoc(approval.delete 'staff').last
              approval.merge(staff: user)
            end
            project.approvals.create approvals
          end
          unless answers.nil?
            answers = answers.map do |answer|
              question = project_questions.assoc(answer.delete 'question').last
              answer.merge project_question: question
            end
            project.project_answers.create answers
          end
        end]
    end

    sample_data 'product_instances' do |data|
      alerts = data.delete 'alerts'
      product = products.assoc(data.delete('product')).last
      project = projects.assoc(data.delete('project')).last
      [data.delete('_assoc'), ProductInstance.create(data.merge product: product, project: project).tap do |instance|
          instance.alerts.create(alerts) unless alerts.nil?
        end]
    end

    sample_data 'wizard_questions' do |data|
      answers = data.delete 'answers'
      [data.delete('_assoc'), WizardQuestion.create(data).tap { |q| q.wizard_answers.create answers }]
    end

    # sample_data 'orders' do |data|
    #   staff = Staff.find_by email: data.delete('staff')
    #   project = Project.find_by name: data.delete('project')
    #   order_items = data.delete 'order_items'
    #   Order.create(data.merge staff: staff, project: project).tap do |order|
    #     order_items.each do |item_data|
    #       product = Product.find_by name: item_data.delete('product')
    #       OrderItem.create(item_data.merge(
    #         order_id: order.id,
    #         product_id: product.id,
    #         setup_price: product.setup_price,
    #         monthly_price: product.monthly_price,
    #         hourly_price: product.hourly_price
    #       )).tap do |order_item|
    #         ProductInstance.create(
    #           order_item: order_item,
    #           product: product,
    #           project: project
    #         )
    #       end
    #     end
    #   end
    # end
  end

end
