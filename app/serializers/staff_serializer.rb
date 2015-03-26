# == Schema Information
#
# Table name: staff
#
#  id                     :integer          not null, primary key
#  first_name             :string(255)
#  last_name              :string(255)
#  email                  :string(255)
#  phone                  :string(30)
#  created_at             :datetime
#  updated_at             :datetime
#  encrypted_password     :string(255)      default(""), not null
#  reset_password_token   :string(255)
#  reset_password_sent_at :datetime
#  remember_created_at    :datetime
#  sign_in_count          :integer          default(0), not null
#  current_sign_in_at     :datetime
#  last_sign_in_at        :datetime
#  current_sign_in_ip     :inet
#  last_sign_in_ip        :inet
#  role                   :integer          default(0)
#  deleted_at             :datetime
#  authentication_token   :string(255)
#
# Indexes
#
#  index_staff_on_authentication_token  (authentication_token) UNIQUE
#  index_staff_on_deleted_at            (deleted_at)
#  index_staff_on_email                 (email) UNIQUE
#  index_staff_on_reset_password_token  (reset_password_token) UNIQUE
#

class StaffSerializer < ApplicationSerializer
  attributes :id, :first_name, :last_name, :email, :phone, :role, :created_at, :updated_at, :api_token

  has_many :orders
  has_many :staff_projects
  has_many :user_settings
  has_many :notifications
  has_many :projects
  has_one :cart
end
