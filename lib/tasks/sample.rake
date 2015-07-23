namespace :sample do
  desc 'Reset Auto Increment Ids'
  task reset: :environment do
    Alert.connection.execute('ALTER SEQUENCE alerts_id_seq RESTART 1')
    Order.connection.execute('ALTER SEQUENCE orders_id_seq RESTART 1')
    OrderItem.connection.execute('ALTER SEQUENCE order_items_id_seq RESTART 1')
    Project.connection.execute('ALTER SEQUENCE projects_id_seq RESTART 1')
    Product.connection.execute('ALTER SEQUENCE products_id_seq RESTART 1')
    Staff.connection.execute('ALTER SEQUENCE staff_id_seq RESTART 1')
    Group.connection.execute('ALTER SEQUENCE group_id_seq RESTART 1')
    GroupsStaff.connection.execute('ALTER SEQUENCE groups_staff_id_seq RESTART 1')
    Role.connection.execute('ALTER SEQUENCE role_id_seq RESTART 1')
    Membership.connection.execute('ALTER SEQUENCE membership_id_seq RESTART 1')
  end

  desc 'Generates demo data'
  task demo: :environment do
    wizard = {
        'Will this be a public or private cloud?' =>
            [
                {
                    text: 'Public',
                    tags_to_add: ['public'],
                    tags_to_remove: ['private']
                },
                {
                    text: 'Private',
                    tags_to_add: ['private'],
                    tags_to_remove: ['public']
                }
            ],
        'What programming language will be used?' => [
            {
                text: 'PHP',
                tags_to_add: ['PHP', 'Linux'],
                tags_to_remove: ['Windows', 'Java', 'Ruby', 'dotNet']
            },
            {
                text: 'Ruby',
                tags_to_add: ['Linux', 'Ruby', 'dotNet'],
                tags_to_remove: ['PHP', 'Windows', 'Java', 'dotNet']
            },
            {
                text: 'Java',
                tags_to_add: ['Linux', 'Windows', 'Java'],
                tags_to_remove: ['PHP', 'Ruby', 'dotNet']
            },
            {
                text: 'dotNet',
                tags_to_add: ['dotNet', 'Windows'],
                tags_to_remove: ['Linux', 'Java', 'Ruby', 'PHP']
            },
            {
                text: 'Perl',
                tags_to_add: ['Perl', 'Linux'],
                tags_to_remove: ['Windows']
            }
        ],
        'Does this require FedRAMP certification?' =>
            [
                {
                    text: 'Yes',
                    tags_to_add: ['FedRAMP'],
                    tags_to_remove: []
                },
                {
                    text: 'No',
                    tags_to_add: [],
                    tags_to_remove: ['FedRamp']
                }
            ],
        'What FISMA Classifaction is needed?' =>
            [
                {
                    text: 'Low',
                    tags_to_add: ['FISMAlow', 'FISMAmedium', 'FISMAhigh'],
                    tags_to_remove: ['FISMAhigh', 'NonFISMA']
                },
                {
                    text: 'Medium',
                    tags_to_add: ['FISMAmedium', 'FISMAhigh'],
                    tags_to_remove: ['FISMAlow', 'NonFISMA']
                },
                {
                    text: 'High',
                    tags_to_add: ['FISMAhigh'],
                    tags_to_remove: ['FISMAlow', 'FISMAmedium', 'NonFISMA']
                }
            ],
        'What is your preferred Cloud Provider?' =>
            [
                {
                    text: 'AWS',
                    tags_to_add: ['AWS'],
                    tags_to_remove: ['VMware', 'Azure']
                },
                {
                    text: 'VMWare',
                    tags_to_add: ['VMWare'],
                    tags_to_remove: ['AWS', 'Azure']
                },
                {
                    text: 'Azure',
                    tags_to_add: ['Azure'],
                    tags_to_remove: ['AWS', 'VMWare']
                }
            ],
        'Will you require high availability' =>
            [
                {
                    text: 'Yes',
                    tags_to_add: ['HA'],
                    tags_to_remove: []
                },
                {
                    text: 'No',
                    tags_to_add: [],
                    tags_to_remove: ['HA']
                }
            ],
    }

    wizard.each do |question, answers|
      unless WizardQuestion.find_by(text: question)
        question = WizardQuestion.create(text: question)
        question.wizard_answers.create(answers)
      end
    end

    Staff.create!([
      { id: 4, first_name: "Unused", last_name: "Staff", email: "unused@projectjellyfish.org", phone: nil, password: "jellyfish", reset_password_token: nil, reset_password_sent_at: nil, remember_created_at: nil, sign_in_count: 0, current_sign_in_at: nil, last_sign_in_at: nil, current_sign_in_ip: nil, last_sign_in_ip: nil, role: 0, deleted_at: nil},
      { id: 2, first_name: "ManageIQ", last_name: "Staff", email: "miq@projectjellyfish.org", phone: nil, password: "jellyfish", reset_password_token: nil, reset_password_sent_at: nil, remember_created_at: nil, sign_in_count: 17, current_sign_in_at: "2015-02-06 17:04:10", last_sign_in_at: "2015-02-06 16:57:41", current_sign_in_ip: "54.172.90.47", last_sign_in_ip: "54.172.90.47", role: 1, deleted_at: nil},
      { id: 3, first_name: "User", last_name: "Staff", email: "user@projectjellyfish.org", phone: nil, password: "jellyfish", reset_password_token: nil, reset_password_sent_at: nil, remember_created_at: nil, sign_in_count: 4, current_sign_in_at: "2015-02-13 18:00:54", last_sign_in_at: "2015-02-12 19:37:15", current_sign_in_ip: "128.229.4.2", last_sign_in_ip: "128.229.4.2", role: 0, deleted_at: nil},
      { id: 5, first_name: "All", last_name: "Users", email: "projectjellyfish@bah.com", phone: nil, password: "jellyfish", reset_password_token: nil, reset_password_sent_at: nil, remember_created_at: nil, sign_in_count: 0, current_sign_in_at: nil, last_sign_in_at: nil, current_sign_in_ip: nil, last_sign_in_ip: nil, role: 0, deleted_at: nil},
      { id: 1, first_name: "Admin", last_name: "Staff", email: "admin@projectjellyfish.org", phone: nil, password: "jellyfish", reset_password_token: nil, reset_password_sent_at: nil, remember_created_at: nil, sign_in_count: 36, current_sign_in_at: "2015-02-18 00:39:32", last_sign_in_at: "2015-02-17 20:28:51", current_sign_in_ip: "127.0.0.1", last_sign_in_ip: "108.45.125.67", role: 1, deleted_at: nil}
    ])
    Staff.connection.execute("ALTER SEQUENCE staff_id_seq RESTART #{Staff.all.order('id DESC').first.id + 1}")

    Cloud.create!([
      { id: 1, name: "AWS", description: nil, extra: "{}", deleted_at: nil},
      { id: 2, name: "Azure", description: nil, extra: "{}", deleted_at: nil},
      { id: 3, name: "Rackspace", description: nil, extra: "{}", deleted_at: nil},
      { id: 4, name: "VMware", description: nil, extra: nil, deleted_at: nil},
      { id: 5, name: "Google", description: nil, extra: nil, deleted_at: nil},
      { id: 6, name: "Other", description: nil, extra: nil, deleted_at: nil},
      { id: 7, name: "OpenStack", description: nil, extra: nil, deleted_at: nil}
    ])
    Cloud.connection.execute("ALTER SEQUENCE clouds_id_seq RESTART #{Cloud.all.order('id DESC').first.id + 1}")

    ProductCategory.create!([
      { name: 'Compute', description: 'Compute and server resources', tag_list: %w(server) },
      { name: 'Storage', description: 'Media and CDN delivery', tag_list: %w(storage cdn) },
      { name: 'Database', description: 'Databases', tag_list: %w(database) },
      { name: 'Applications', description: 'Applications', tag_list: %w(application) },
      { name: 'Application Stacks', description: 'One or more services brought together to serve applications', tag_list: %w(stack) },
      { name: 'Analysis', description: 'Analytics and research computation', tag_list: %w(analysis) },
      { name: 'Staff', description: 'Personnel and staffing needs', tag_list: %w(staff) },
      { name: 'Open Source', description: 'Open Source Software and other open source offerings', tag_list: %w(oss) }
    ])

    Product.create!([
      # Servers
      { name: 'AWS Small EC2', description: 't2.small EC2', active: true, img: 'products/aws_ec2.png', deleted_at: nil, product_type: 'AWS Fog Infrastructure', setup_price: 0.0, hourly_price: 0.026, monthly_price: 0.0, tag_list: %w(server aws small development ec2), provisioning_answers: {flavor_id: 't1.micro',disk_size: '20'} },
      { name: 'AWS Medium EC2', description: 'm3.medium EC2', active: true, img: 'products/aws_ec2.png', deleted_at: nil, product_type: 'AWS Fog Infrastructure', setup_price: 0.0, hourly_price: 0.080, monthly_price: 0.0, tag_list: %w(server aws medium production ec2), provisioning_answers: {flavor_id: 'm3.medium',disk_size: '200'} },
      { name: 'AWS Large EC2', description: 'm3.large EC2', active: true, img: 'products/aws_ec2.png', deleted_at: nil, product_type: 'AWS Fog Infrastructure', setup_price: 0.0, hourly_price: 0.13, monthly_price: 0.14, tag_list: %w(server aws large production ec2), provisioning_answers: {flavor_id: 'm3.large',disk_size: '200'} },
      { name: 'RHEL 6 Small', description: 'Small RHEL 6 Instance', active: true, img: 'products/redhat.png', deleted_at: nil, product_type: 'Infrastructure', setup_price: '0.0', hourly_price: '0.08', monthly_price: '0.0', tag_list: %w(server aws small development ec2 redhat rhel rhel-6 linux) },
      { name: 'RHEL 6 Medium', description: 'RHEL 6 Medium', active: true, img: 'products/redhat.png', deleted_at: nil, product_type: 'Infrastructure', setup_price: '0.0', hourly_price: '0.2', monthly_price: '0.0', tag_list: %w(server aws medium production ec2 redhat rhel rhel-6 linux) },
      { name: 'RHEL 6 Large ', description: 'Large RHEL 6', active: true, img: 'products/redhat.png', deleted_at: nil, product_type: 'Infrastructure', setup_price: '0.0', hourly_price: '0.7', monthly_price: '0.0', tag_list: %w(server aws large production ec2 redhat rhel rhel-6 linux) },
      { name: 'Windows Server 2012', description: 'Windows Server 2012 R2 Datacenter', active: true, img: 'products/windows.png', deleted_at: nil, product_type: 'Azure Fog Infrastructure', setup_price: 0.0, hourly_price: 0.077, monthly_price: 0.0, tag_list: %w(server database azure large production windows windows-2012 sqlserver), provisioning_answers: "{'image': 'a699494373c04fc0bc8f2bb1389d6106__Win2K8R2SP1-Datacenter-201504.01-en.us-127GB.vhd','vm_name': 'fogvmclone','vm_user': 'jellyfish','location': 'West US','password': 'ComplexPassword!123','storage_account_name': 'fogvmclonestorage'}" },
      # Databases
      { name: 'Small MySQL', description: 't2.small MySQL', active: true, img: 'products/aws_rds.png', deleted_at: nil, product_type: 'AWS Fog Databases', setup_price: 0.0, hourly_price: 0.034, monthly_price: 0.0, tag_list: %w(database aws mysql small development rds mysql-5 mysql-55), provisioning_answers: {DBInstanceClass: 'db.t2.small', AllocatedStorage: '20', StorageType: 'standard', availability: 'reduced', Engine: 'mysql'} },
      { name: 'Medium MySQL', description: 'm3.medium MySQL', active: true, img: 'products/aws_rds.png', deleted_at: nil, product_type: 'AWS Fog Databases', setup_price: 0.0, hourly_price: 0.090, monthly_price: 0.0, tag_list: %w(database aws mysql medium production rds mysql-5 mysql-55), provisioning_answers: {DBInstanceClass: 'db.m3.medium', AllocatedStorage: '40', StorageType: 'standard', availability: 'reduced', Engine: 'mysql'} },
      { name: 'Large MySQL', description: 'm3.large MySQL', active: true, img: 'products/aws_rds.png', deleted_at: nil, product_type: 'AWS Fog Databases', setup_price: 0.0, hourly_price: 0.185, monthly_price: 0.0, tag_list: %w(database aws mysql large production rds mysql-5 mysql-55), provisioning_answers: {DBInstanceClass: 'db.m3.large', AllocatedStorage: '60', StorageType: 'standard', availability: 'reduced', Engine: 'mysql'} },
      { name: 'Small PostgreSQL', description: 'Small PostgreSQL', active: true, img: 'products/aws_rds.png', deleted_at: nil, product_type: 'Databases', setup_price: '1.0', hourly_price: '1.0', monthly_price: '1.0', tag_list: %w(database aws postgres small development rds postgresql postgres-9 postgres-94) },
      { name: 'Medium PostgreSQL', description: 'Medium PostgreSQL', active: true, img: 'products/aws_rds.png', deleted_at: nil, product_type: 'Databases', setup_price: '2.99', hourly_price: '0.004', monthly_price: '0.25', tag_list: %w(database aws postgres medium production rds postgresql postgres-9 postgres-94) },
      { name: 'Large PostgreSQL', description: 'Large PostgreSQL', active: true, img: 'products/aws_rds.png', deleted_at: nil, product_type: 'Databases', setup_price: '3.99', hourly_price: '0.009', monthly_price: '0.5', tag_list: %w(database aws postgres large production rds postgresql postgres-9 postgres-94) },
      { name: 'Medium Aurora', description: 'Medium Aurora', active: true, img: 'products/aws_rds.png', deleted_at: nil, product_type: 'Databases', setup_price: '4.99', hourly_price: '0.015', monthly_price: '0.95', tag_list: %w(database aws aurora medium production rds) },
      { name: 'Medium SQL Server', description: 'Medium SQL Server', active: true, img: 'products/aws_rds.png', deleted_at: nil, product_type: 'Databases', setup_price: '5.99', hourly_price: '0.025', monthly_price: '1.29', tag_list: %w(database aws sqlserver medium production rds windows windows-2012) },
      { name: 'Large SQL Server', description: 'Large SQL Server', active: true, img: 'products/aws_rds.png', deleted_at: nil, product_type: 'Databases', setup_price: '5.99', hourly_price: '0.025', monthly_price: '1.29', tag_list: %w(database aws sqlserver large production rds windows windows-2012) },
      # Storage
      { name: 'West Coast Storage', description: 'Normal, Northern California', active: true, img: 'products/aws_s3.png', deleted_at: nil, product_type: 'Databases', setup_price: '0.99', hourly_price: '0.001', monthly_price: '0.05', tag_list: %w(storage aws development production s3) },
      { name: '1GB NetApps Storage', description: 'NetApps Storage', active: true, img: 'products/netapp.png', deleted_at: nil, product_type: 'Storage', setup_price: '10.0', hourly_price: '10.0', monthly_price: '10.0', tag_list: %w(storage production netapps) },
      { name: 'AWS S3 Bucket', description: '', active: true, img: 'products/aws_s3.png', deleted_at: nil, product_type: 'AWS Fog Storage', setup_price: '1.0', hourly_price: '1.0', monthly_price: '1.0', tag_list: %w(storage aws development production s3) },
      { name: 'Teradata', description: 'Teradata', active: true, img: 'products/teradata.png', deleted_at: nil, product_type: 'Big Data', setup_price: '10.0', hourly_price: '10.0', monthly_price: '10.0', tag_list: %w(storage database production teradata big-data) },
      # Applications
      { name: 'LAMP Stack', description: 'Linux, Apache, MySQL, PHP', active: true, img: 'products/php.png', deleted_at: nil, product_type: 'Platforms', setup_price: '10.0', hourly_price: '10.0', monthly_price: '10.0', tag_list: %w(application stack aws production linux apache php lamp) },
      { name: 'Rails Stack', description: 'Ruby on Rails Stack', active: true, img: 'products/rails.png', deleted_at: nil, product_type: 'Platforms', setup_price: '10.0', hourly_price: '3.0', monthly_price: '5.0', tag_list: %w(application stack aws production ruby rails) },
      { name: 'MEAN Stack', description: 'MongoDB, ExpressJS, AngularJS, NodeJS.', active: true, img: 'products/mean.png', deleted_at: nil, product_type: 'Platforms', setup_price: '10.0', hourly_price: '10.0', monthly_price: '10.0', tag_list: %w(application stack aws production mongodb express angularjs nodejs mean) },
      { name: 'JIRA Project', description: 'A project in corporate JIRA instance.', active: true, img: 'products/jira.png', deleted_at: nil, product_type: 'Applications', setup_price: '10.0', hourly_price: '10.0', monthly_price: '10.0', tag_list: %w(application aws production jira tracker ticket bug issue) },
      { name: 'Confluence Project', description: 'Confluence Project', active: true, img: 'products/confluence.png', deleted_at: nil, product_type: 'Applications', setup_price: '10.0', hourly_price: '10.0', monthly_price: '10.0', tag_list: %w(application aws production confluence wiki) },
      { name: 'Bugzilla Instance', description: 'Bugzilla Instance', active: true, img: 'products/bugzilla.png', deleted_at: nil, product_type: 'Applications', setup_price: '10.0', hourly_price: '10.0', monthly_price: '10.0', tag_list: %w(application aws production bugzilla tracker ticket bug issue oss) },
      { name: 'Apache Web Server', description: 'Apache Web Server', active: true, img: 'products/apache.png', deleted_at: nil, product_type: 'Infrastructure', setup_price: '10.0', hourly_price: '10.0', monthly_price: '10.0', tag_list: %w(application server aws production apache web oss) },
      { name: 'MS Exchange Server', description: 'MS Exchange Server', active: true, img: 'products/exchange.png', deleted_at: nil, product_type: 'Platforms', setup_price: '0.0', hourly_price: '3.5', monthly_price: '5.0', tag_list: %w(application server aws production exchange email mail windows windows-2012) },
      # Other
      { name: 'Sr. Java Developer', description: '', active: true, img: 'products/woman.png', deleted_at: nil, product_type: 'Staff', setup_price: '10.0', hourly_price: '10.0', monthly_price: '10.0', tag_list: %w(staff java engineer developer senior) },
      { name: 'Sr. System Administrator', description: 'Sr. System Administrator', active: true, img: 'products/woman.png', deleted_at: nil, product_type: 'Staff', setup_price: '10.0', hourly_price: '10.0', monthly_price: '10.0', tag_list: %w(staff system administrator senior) },
      { name: 'Project Manager', description: 'Project Manager', active: true, img: 'products/man.png', deleted_at: nil, product_type: 'Staff', setup_price: '10.0', hourly_price: '10.0', monthly_price: '10.0', tag_list: %w(staff project manager) },
      { name: '100 Node Hadoop Cluster', description: nil, active: true, img: 'products/hadoop.png', deleted_at: nil, product_type: 'Big Data', setup_price: '10.0', hourly_price: '10.0', monthly_price: '10.0', tag_list: %w(server cluster large big-data hadoop) },
      { name: '10 Node Hadoop Cluster', description: nil, active: true, img: 'products/hadoop.png', deleted_at: nil, product_type: 'Big Data', setup_price: '10.0', hourly_price: '10.0', monthly_price: '10.0',  tag_list: %w(server cluster small big-data hadoop) },
      { name: 'Monte Carlo', description: 'Monte Carlo Simulation', active: true, img: 'products/algorithm.png', deleted_at: nil, product_type: 'Big Data', setup_price: '10.0', hourly_price: '10.0', monthly_price: '10.0', tag_list: %w(analysis big-data monte-carlo) },
      { name: 'Genome Modeling', description: '3D Genomic Modeling', active: true, img: 'products/algorithm.png', deleted_at: nil, product_type: 'Big Data', setup_price: '10.0', hourly_price: '10.0', monthly_price: '10.0', tag_list: %w(analysis modeling genome) },
      { name: 'Neural Network', description: 'Neural Network Modeling', active: true, img: 'products/algorithm.png', deleted_at: nil, product_type: 'Big Data', setup_price: '10.0', hourly_price: '10.0', monthly_price: '10.0', tag_list: %w(analysis modeling brain neural) } ,
      { name: 'Satellite Data', description: 'Satellite Data from Eastern Hemisphere', active: true, img: 'products/dataset.png', deleted_at: nil, product_type: 'Datasets', setup_price: '0.0', hourly_price: '0.0', monthly_price: '0.0', tag_list: %w(analysis big-data satellite mapping) },
      { name: 'Air Traffic Logs', description: 'Air Traffic Controller Logs', active: true, img: 'products/dataset.png', deleted_at: nil, product_type: 'Datasets', setup_price: '0.0', hourly_price: '0.0', monthly_price: '0.0', tag_list: %w(analysis big-data logging processing) },
      { name: 'Human Genome', description: 'Sequenced Human Genome', active: true, img: 'products/dataset.png', deleted_at: nil, product_type: 'Datasets', setup_price: '0.0', hourly_price: '0.0', monthly_price: '0.0', tag_list: %w(analysis big-data modeling genome) },
      { name: 'Ebola Genome', description: 'Ebola Virus Genome', active: true, img: 'products/dataset.png', deleted_at: nil, product_type: 'Datasets', setup_price: '0.0', hourly_price: '0.0', monthly_price: '0.0', tag_list: %w(analysys modeling genome) },
      { name: 'Anthrax Genome', description: 'Bacillus Anthracis Genome', active: true, img: 'products/dataset.png', deleted_at: nil, product_type: 'Datasets', setup_price: '0.0', hourly_price: '0.0', monthly_price: '0.0', tag_list: %w(analysis modeling genome) },
    ])

    Project.create!([
      { id: 1, name: "Analytics Platform", description: "Project description", cc: "--CC--", budget: 30000.0, staff_id: "--STAFF_ID--", start_date: "2015-02-06", end_date: "2015-11-06", img: "projects/documentation.png", deleted_at: nil, spent: 0.0, status: 0, approval: 1},
      { id: 2, name: "Mobile App API", description: "Project description", cc: "--CC--", budget: 5000.0, staff_id: "--STAFF_ID--", start_date: "2015-02-06", end_date: "2015-11-06", img: "projects/icon-mobile-orange.png", deleted_at: nil, spent: 2000.0, status: 0, approval: 1},
      { id: 3, name: "Blog", description: "Project description", cc: "--CC--", budget: 10000, staff_id: "--STAFF_ID--", start_date: "2015-02-06", end_date: "2015-11-06", img: "projects/128x128-wordpress.png", deleted_at: nil, spent: 4135.03, status: 0, approval: 1},
      { id: 4, name: "Cloud File Share", description: "Project description", cc: "--CC--", budget: 1000.0, staff_id: "--STAFF_ID--", start_date: "2015-02-06", end_date: "2015-11-06", img: "projects/cloud-checkmark-128.png", deleted_at: nil, spent: 0.0, status: 0, approval: 1},
      { id: 5, name: "Cloud Exchange", description: nil, cc: nil, budget: 50000.0, staff_id: nil, start_date: "2015-02-12", end_date: "2016-02-11", img: nil, deleted_at: nil, spent: 35000.0, status: 0, approval: 0},
      { id: 6, name: "Project Jellyfish Demo", description: nil, cc: nil, budget: 10000.0, staff_id: nil, start_date: "2015-02-13", end_date: "2015-03-13", img: nil, deleted_at: nil, spent: 9000.0, status: 0, approval: 0}
    ])
    Project.connection.execute("ALTER SEQUENCE projects_id_seq RESTART #{Project.all.order('id DESC').first.id + 1}")

    ProjectQuestion.create!([
      { id: 1, question: "Project Description", help_text: "", required: true, deleted_at: nil, position: 2, options: [], field_type: 2},
      { id: 2, question: "Project Charge Code", help_text: "", required: true, deleted_at: nil, position: 3, options: [], field_type: 2},
      { id: 3, question: "Maintenance Day", help_text: "", required: true, deleted_at: nil, position: 4, options: [], field_type: 3},
      { id: 4, question: "Performed Maintenance", help_text: "", required: true, deleted_at: nil, position: 5, options: [], field_type: 0},
      { id: 5, question: "Default provisioning location", help_text: "", required: true, deleted_at: nil, position: 6, options: [{option: "East Coast Data Center", include: [], exclude: [], position: 0},{option: "West Coast Data Center", include: [], exclude: [], position: 1}, {option: "Classified Data Center", include: [], exclude: [], position: 2}], field_type: 1},
      { id: 6, question: "Will this run in production?", help_text: "", required: true, deleted_at: nil, position: 7, options: [], field_type: 4},
      { id: 7, question: "FISMA Classification", help_text: "", required: true, deleted_at: nil, position: 8, options: [{option: "Low", include: [], exclude: [], position: 0}, {option: "Medium", include: [], exclude: [], position: 1}, {option: "High", include: [], exclude: [], position: 2}], field_type: 1},
      { id: 8, question: "Period of Performance", help_text: "in months", required: nil, deleted_at: nil, position: 1, field_type: 2}
    ])
    ProjectQuestion.connection.execute("ALTER SEQUENCE project_questions_id_seq RESTART #{ProjectQuestion.all.order('id DESC').first.id + 1}")

    Approval.create!([
    { id: 1, staff_id: 3, project_id: 1, approved: false, reason: nil},
    { id: 2, staff_id: 3, project_id: 2, approved: true, reason: nil}
  ])
    Approval.connection.execute("ALTER SEQUENCE approvals_id_seq RESTART #{Approval.all.order('id DESC').first.id + 1}")

    Order.create!([
      { id: 1, :staff => Staff.where(id: 1).first, engine_response: nil, active: nil, deleted_at: nil, total: 0.0},
      { id: 2, :staff => Staff.where(id: 1).first, engine_response: nil, active: nil, deleted_at: nil, total: 0.0},
      { id: 3, :staff => Staff.where(id: 1).first, engine_response: nil, active: nil, deleted_at: nil, total: 0.0},
      { id: 4, :staff => Staff.where(id: 1).first, engine_response: nil, active: nil, deleted_at: nil, total: 0.0},
      { id: 5, :staff => Staff.where(id: 1).first, engine_response: nil, active: nil, deleted_at: nil, total: 0.0},
      { id: 6, :staff => Staff.where(id: 1).first, engine_response: nil, active: nil, deleted_at: nil, total: 0.0},
      { id: 7, :staff => Staff.where(id: 1).first, engine_response: nil, active: nil, deleted_at: nil, total: 0.0},
      { id: 8, :staff => Staff.where(id: 1).first, engine_response: nil, active: nil, deleted_at: nil, total: 0.0},
      { id: 9, :staff => Staff.where(id: 1).first, engine_response: nil, active: nil, deleted_at: nil, total: 0.0}
    ])
    Order.connection.execute("ALTER SEQUENCE orders_id_seq RESTART #{Order.all.order('id DESC').first.id + 1}")

    OrderItem.create!([
      { id: 8, order_id: 2, cloud_id: 1, :product => Product.where(name: 'Medium PostgreSQL').first, service_id: nil, provision_status: 2, deleted_at: nil, :project => Project.where(id: 3).first, miq_id: nil, uuid: "4f249639-17ca-493d-8548-9b0728bfc99b", setup_price: "1.99", hourly_price: "0.004", monthly_price: "0.1", payload_request: nil, payload_acknowledgement: nil, payload_response: { defaults: { ip_address: '127.0.0.1', total: '0.0', hostname: 'TBD' } } },
      { id: 4, order_id: 1, cloud_id: 1, :product => Product.where(name: 'West Coast Storage').first, service_id: nil, provision_status: 0, deleted_at: nil, :project => Project.where(id: 2).first, miq_id: nil, uuid: "0c01b271-fcc6-4fdd-9dab-21f3f2f44e59", setup_price: "0.99", hourly_price: "0.01", monthly_price: "0.05", payload_request: nil, payload_acknowledgement: nil, payload_response: { defaults: { ip_address: '127.0.0.1', total: '0.0', hostname: 'TBD' } } },
      { id: 10, order_id: 3, cloud_id: 1, :product => Product.where(name: 'RHEL 6 Medium').first, service_id: nil, provision_status: 0, deleted_at: nil, :project => Project.where(id: 4).first, miq_id: nil, uuid: "e8e488c2-ca19-4d6f-aaf1-42d28050904d", setup_price: "2.99", hourly_price: "0.0025", monthly_price: "0.075", payload_request: nil, payload_acknowledgement: nil, payload_response: { defaults: { ip_address: '127.0.0.1', total: '0.0', hostname: 'TBD' } } },
      { id: 12, order_id: 3, cloud_id: 1, :product => Product.where(name: 'West Coast Storage').first, service_id: nil, provision_status: 0, deleted_at: nil, :project => Project.where(id: 4).first, miq_id: nil, uuid: "ee0164e6-89b7-451f-8351-8fd3d52d4eee", setup_price: "0.99", hourly_price: "0.001", monthly_price: "0.05", payload_request: nil, payload_acknowledgement: nil, payload_response: { defaults: { ip_address: '127.0.0.1', total: '0.0', hostname: 'TBD' } } },
      { id: 6, order_id: 2, cloud_id: 1, :product => Product.where(name: 'RHEL 6 Medium').first, service_id: nil, provision_status: 0, deleted_at: nil, :project => Project.where(id: 3).first, miq_id: nil, uuid: "152a5fb2-708c-412c-9187-3030d07089fd", setup_price: "2.99", hourly_price: "0.0025", monthly_price: "0.075", payload_request: nil, payload_acknowledgement: nil, payload_response: { defaults: { ip_address: '127.0.0.1', total: '0.0', hostname: 'TBD' } } },
      { id: 11, order_id: 3, cloud_id: 1, :product => Product.where(name: 'Large PostgreSQL').first, service_id: nil, provision_status: 2, deleted_at: nil, :project => Project.where(id: 4).first, miq_id: nil, uuid: "8402db1c-b0ca-43b0-9e65-d442be7683ed", setup_price: "3.99", hourly_price: "0.009", monthly_price: "0.5", payload_request: nil, payload_acknowledgement: nil, payload_response: { defaults: { ip_address: '127.0.0.1', total: '0.0', hostname: 'TBD' } } },
      { id: 2, order_id: 1, cloud_id: 1, :product => Product.where(name: 'RHEL 6 Small').first, service_id: nil, provision_status: 0, deleted_at: nil, :project => Project.where(id: 2).first, miq_id: nil, uuid: "7ee39a34-8fb2-4cf4-979a-9ae4d480b6e6", setup_price: "1.99", hourly_price: "0.05", monthly_price: "0.05", payload_request: nil, payload_acknowledgement: nil, payload_response: { defaults: { ip_address: '127.0.0.1', total: '0.0', hostname: 'TBD' } } },
      { id: 3, order_id: 1, cloud_id: 1, :product => Product.where(name: 'Medium PostgreSQL').first, service_id: nil, provision_status: 1, deleted_at: nil, :project => Project.where(id: 2).first, miq_id: nil, uuid: "69ea7d91-e7bb-4854-9ff2-bcd167fe6a71", setup_price: "2.99", hourly_price: "0.09", monthly_price: "0.25", payload_request: nil, payload_acknowledgement: nil, payload_response: { defaults: { ip_address: '127.0.0.1', total: '0.0', hostname: 'TBD' } } },
      { id: 20, order_id: 8, cloud_id: 1, :product => Product.where(name: 'Rails Stack').first, service_id: nil, provision_status: nil, deleted_at: nil, :project => Project.where(id: 3).first, miq_id: nil, uuid: "44642c1d-2fb9-41d8-9acf-d57e87da61fd", setup_price: "0.0", hourly_price: "2.0", monthly_price: "0.0", payload_request: nil, payload_acknowledgement: nil, payload_response: { defaults: { ip_address: '127.0.0.1', total: '0.0', hostname: 'TBD' } } },
      { id: 21, order_id: 9, cloud_id: 2, :product => Product.where(name: 'Apache Web Server').first, service_id: nil, provision_status: nil, deleted_at: nil, :project => Project.where(id: 3).first, miq_id: nil, uuid: "add8e14e-6ac2-4476-a9f5-84c6b351a716", setup_price: "0.0", hourly_price: "3.5", monthly_price: "0.0", payload_request: nil, payload_acknowledgement: nil, payload_response: { defaults: { ip_address: '127.0.0.1', total: '0.0', hostname: 'TBD' } } }
    ])
    OrderItem.connection.execute("ALTER SEQUENCE order_items_id_seq RESTART #{OrderItem.all.order('id DESC').first.id + 1}")

    Organization.create!([
      { id: 1, name: "jellyfish", description: "jellyfish super group", img: nil}
    ])
    Organization.connection.execute("ALTER SEQUENCE organizations_id_seq RESTART #{Organization.all.order('id DESC').first.id + 1}")

    Alert.create!([
      { id: 1, status: "ok", message: "The sytstem will undergo maintenance in 360 days.", start_date: nil, end_date: nil, alertable_id: 1, alertable_type: Organization, category: 'maintenance'},
      { id: 2, status: "critical", message: "The sytstem will undergo maintenance in 1 day.", start_date: nil, end_date: nil, alertable_id: 1, alertable_type: Organization, category: 'maintenance'},
      { id: 3, status: "warning", message: "The sytstem will undergo maintenance in 3 days.", start_date: nil, end_date: nil, alertable_id: 1, alertable_type: Organization, category: 'maintenance'},
      { id: 4, status: "ok", message: "Security audit was successfully completed.", start_date: nil, end_date: nil, alertable_id: 1, alertable_type: Organization, category: 'security'},
      { id: 5, status: "critical", message: "Security audit will occur in 1 day.", start_date: nil, end_date: nil, alertable_id: 1, alertable_type: Organization, category: 'security'},
      { id: 6, status: "warning", message: "Security audit will occur in 7 days.", start_date: nil, end_date: nil, alertable_id: 1, alertable_type: Organization, category: 'security'},
      { id: 7, status: "ok", message: "Blog has 6 month of funding, please increase budget.", start_date: nil, end_date: nil, alertable_id: 3, alertable_type: Project, category: 'budget'},
      { id: 8, status: "warning", message: "Blog has 3 months of funding, please increase budget.", start_date: nil, end_date: nil, alertable_id: 3, alertable_type: Project, category: 'budget'},
      { id: 9, status: "critical", message: "Blog has 1 month of funding, please increase budget.", start_date: nil, end_date: nil, alertable_id: 3, alertable_type: Project, category: 'budget'},
      { id: 10, status: "critical", message: "Blog has exceeded number of allowed users.", start_date: nil, end_date: nil, alertable_id: 3, alertable_type: Project, category: 'capacity'},
      { id: 11, status: "ok", message: "Blog has an acceptable number of users.", start_date: nil, end_date: nil, alertable_id: 3, alertable_type: Project, category: 'capacity'},
      { id: 12, status: "warning", message: "Blog user base has doubled.", start_date: nil, end_date: nil, alertable_id: 3, alertable_type: Project, category: 'capacity'},
      { id: 13, status: "ok", message: "Blog passed audit.", start_date: nil, end_date: nil, alertable_id: 3, alertable_type: Project, category: 'security'},
      { id: 14, status: "warning", message: "Medium PostgreSQL is at 85% capcity.", start_date: nil, end_date: nil, alertable_id: 3, alertable_type: OrderItem, category: 'capacity'},
      { id: 15, status: "critical", message: "Medium PostgreSQL is at 95% capacity.", start_date: nil, end_date: nil, alertable_id: 3, alertable_type: OrderItem, category: 'capacity'},
      { id: 16, status: "ok", message: "Medium PostgreSQL is at 35% capacity.", start_date: nil, end_date: nil, alertable_id: 3, alertable_type: OrderItem, category: 'capacity'},
      { id: 17, status: "warning", message: "Medium PostgreSQL license expires in 5 days.", start_date: nil, end_date: nil, alertable_id: 3, alertable_type: OrderItem, category: 'license'},
      { id: 18, status: "critical", message: "Medium PostgreSQL license expires in 1 day.", start_date: nil, end_date: nil, alertable_id: 3, alertable_type: OrderItem, category: 'license'},
      { id: 19, status: "ok", message: "Medium PostgreSQL license in 360 days.", start_date: nil, end_date: nil, alertable_id: 3, alertable_type: OrderItem, category: 'license'},
      { id: 20, status: "warning", message: "RHEL 6 license expires in 5 days.", start_date: nil, end_date: nil, alertable_id: 2, alertable_type: OrderItem, category: 'license'},
      { id: 21, status: "ok", message: "User has 2 months to complete training.", start_date: nil, end_date: nil, alertable_id: 3, alertable_type: Staff, category: 'training'},
      { id: 22, status: "warning", message: "User has 1 week to complete training.", start_date: nil, end_date: nil, alertable_id: 3, alertable_type: Staff, category: 'training'}
    ])
    Alert.connection.execute("ALTER SEQUENCE alerts_id_seq RESTART #{Alert.all.order('id DESC').first.id + 1}")

    ProjectAnswer.create!([
      { id: 1, project_id: 1, project_question_id: 8, answer: "5" },
      { id: 2, project_id: 1, project_question_id: 7, answer: "High" },
      { id: 3, project_id: 1, project_question_id: 6, answer: "No" },
      { id: 4, project_id: 1, project_question_id: 5, answer: "East Coast Data Center" },
      { id: 5, project_id: 1, project_question_id: 4, answer: "true" },
      { id: 6, project_id: 1, project_question_id: 3, answer: "2015-05-20T05:00:00.000Z" },
      { id: 7, project_id: 1, project_question_id: 2, answer: "4873849128497711" },
      { id: 8, project_id: 1, project_question_id: 1, answer: "A project to demo Analytics Platform." },
      { id: 9, project_id: 2, project_question_id: 8, answer: "5" },
      { id: 10, project_id: 2, project_question_id: 7, answer: "High" },
      { id: 11, project_id: 2, project_question_id: 6, answer: "No" },
      { id: 12, project_id: 2, project_question_id: 5, answer: "East Coast Data Center" },
      { id: 13, project_id: 2, project_question_id: 4, answer: "true" },
      { id: 14, project_id: 2, project_question_id: 3, answer: "2015-05-20T05:00:00.000Z" },
      { id: 15, project_id: 2, project_question_id: 2, answer: "4873849128497761" },
      { id: 16, project_id: 2, project_question_id: 1, answer: "A project to demo Mobile App Api." },
      { id: 17, project_id: 3, project_question_id: 8, answer: "5" },
      { id: 18, project_id: 3, project_question_id: 7, answer: "High" },
      { id: 19, project_id: 3, project_question_id: 6, answer: "No" },
      { id: 20, project_id: 3, project_question_id: 5, answer: "East Coast Data Center" },
      { id: 21, project_id: 3, project_question_id: 4, answer: "true" },
      { id: 22, project_id: 3, project_question_id: 3, answer: "2015-05-20T05:00:00.000Z" },
      { id: 23, project_id: 3, project_question_id: 2, answer: "4873849128497761" },
      { id: 24, project_id: 3, project_question_id: 1, answer: "A project to demo Blog." },
      { id: 25, project_id: 4, project_question_id: 8, answer: "5" },
      { id: 26, project_id: 4, project_question_id: 7, answer: "High" },
      { id: 27, project_id: 4, project_question_id: 6, answer: "No" },
      { id: 28, project_id: 4, project_question_id: 5, answer: "East Coast Data Center" },
      { id: 29, project_id: 4, project_question_id: 4, answer: "true" },
      { id: 30, project_id: 4, project_question_id: 3, answer: "2015-05-20T05:00:00.000Z" },
      { id: 31, project_id: 4, project_question_id: 2, answer: "4873849128497761" },
      { id: 32, project_id: 4, project_question_id: 1, answer: "A project to demo Cloud File Share." },
      { id: 33, project_id: 5, project_question_id: 8, answer: "5" },
      { id: 34, project_id: 5, project_question_id: 7, answer: "High" },
      { id: 35, project_id: 5, project_question_id: 6, answer: "No" },
      { id: 36, project_id: 5, project_question_id: 5, answer: "East Coast Data Center" },
      { id: 37, project_id: 5, project_question_id: 4, answer: "true" },
      { id: 38, project_id: 5, project_question_id: 3, answer: "2015-05-20T05:00:00.000Z" },
      { id: 39, project_id: 5, project_question_id: 2, answer: "4873849128497761" },
      { id: 40, project_id: 5, project_question_id: 1, answer: "A project to demo Cloud Exchange." },
      { id: 41, project_id: 6, project_question_id: 8, answer: "5" },
      { id: 42, project_id: 6, project_question_id: 7, answer: "High" },
      { id: 43, project_id: 6, project_question_id: 6, answer: "No" },
      { id: 44, project_id: 6, project_question_id: 5, answer: "East Coast Data Center" },
      { id: 45, project_id: 6, project_question_id: 4, answer: "true" },
      { id: 46, project_id: 6, project_question_id: 3, answer: "2015-05-20T05:00:00.000Z" },
      { id: 47, project_id: 6, project_question_id: 2, answer: "4873849128497761" },
      { id: 48, project_id: 6, project_question_id: 1, answer: "A project to demo Jellyfish." }
    ])
    ProjectAnswer.connection.execute("ALTER SEQUENCE project_answers_id_seq RESTART #{ProjectAnswer.all.order('id DESC').first.id + 1}")

    Group.create!([
      {id: 1, name: 'Site Administrators', description: 'Administrators for the entire site.'},
      {id: 2, name: 'Project Administrators', description: 'Any administrators for this project.'},
      {id: 3, name: 'Project Managers', description: 'Any project managers for this project.'},
      {id: 4, name: 'Project Staff', description: 'Any staff for this project.'}
    ])
    Group.connection.execute("ALTER SEQUENCE groups_id_seq RESTART #{Group.all.order('id DESC').first.id + 1}")

    GroupsStaff.create!([
      {id: 1, group_id: 1, staff_id: 1},
      {id: 2, group_id: 4, staff_id: 2},
      {id: 3, group_id: 4, staff_id: 3}
    ])
    GroupsStaff.connection.execute("ALTER SEQUENCE groups_staff_id_seq RESTART #{GroupsStaff.all.order('id DESC').first.id + 1}")

    Role.create!([
      {id: 1, name: 'Site Administrators', description: 'Administrator role for the entire site.', permissions: '{"approvals": ["read", "write"], "memberships": ["read", "write"], "projects": ["read", "write"]}'},
      {id: 2, name: 'Project Administrators', description: 'Administrator role for projects.', permissions: '{"approvals": ["read", "write"], "memberships": ["read", "write"]}'},
      {id: 3, name: 'Project Managers', description: 'Manager role for projects.', permissions: '{"approvals": ["read"], "memberships": ["read", "write"]}'}
    ])
    Role.connection.execute("ALTER SEQUENCE roles_id_seq RESTART #{Role.all.order('id DESC').first.id + 1}")

    Membership.create!([
      {id: 1, group_id: 2, project_id: 1, role_id: 2},
      {id: 2, group_id: 2, project_id: 2, role_id: 2},
      {id: 3, group_id: 2, project_id: 3, role_id: 2},
      {id: 4, group_id: 2, project_id: 4, role_id: 2},
      {id: 5, group_id: 2, project_id: 5, role_id: 2},
      {id: 6, group_id: 2, project_id: 6, role_id: 2},
      {id: 7, group_id: 3, project_id: 1, role_id: 2},
      {id: 8, group_id: 3, project_id: 2, role_id: 2},
      {id: 9, group_id: 3, project_id: 3, role_id: 2},
      {id: 10, group_id: 3, project_id: 4, role_id: 2},
      {id: 11, group_id: 3, project_id: 5, role_id: 2},
      {id: 12, group_id: 3, project_id: 6, role_id: 2}
    ])
    Membership.connection.execute("ALTER SEQUENCE memberships_id_seq RESTART #{Membership.all.order('id DESC').first.id + 1}")

    ContentPage.create!([
      {id: 1, staff_id: 1, title: 'foo', body: 'bar'},
      {id: 2, staff_id: 1, title: 'fizz', body: 'buzz'}
    ])
    ContentPage.connection.execute("ALTER SEQUENCE content_pages_id_seq RESTART #{ContentPage.all.order('id DESC').first.id + 1}")
  end

end
