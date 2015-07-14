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

    categories = sample_data('product_categories').map do |data|
      [data.delete('_assoc'), ProductCategory.create(data)]
    end

    product_listings = sample_data('product_listings').map do |data|
      answers = data.delete 'answers'
      [data.delete('_assoc'), Product::Listing.create(data).tap do |listing|
          listing.answers.create(answers) unless answers.nil?
        end]
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

    sample_data 'services' do |data|
      alerts = data.delete 'alerts'
      order = data.delete 'order'
      data['uuid'] = SecureRandom.uuid
      [data.delete('_assoc'), Service.create(data).tap do |service|
        service.alerts.create(alerts) unless alerts.nil?
        product_listing = product_listings.assoc(order.delete('product_listing')).last
        project = projects.assoc(order.delete('project')).last
        order.merge! project: project, product_listing: product_listing
        order.merge! setup_price: product_listing.setup_price,
          hourly_price: product_listing.hourly_price,
          monthly_price: product_listing.monthly_price
        service.create_order order
      end]
    end

    sample_data 'wizard_questions' do |data|
      answers = data.delete 'answers'
      [data.delete('_assoc'), WizardQuestion.create(data).tap { |q| q.wizard_answers.create answers }]
    end
  end

end
