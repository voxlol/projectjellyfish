# == Schema Information
#
# Table name: team_member_products
#
#  id         :integer          not null, primary key
#  created_at :datetime
#  updated_at :datetime
#

class TeamMemberProduct < ActiveRecord::Base
  has_many :products, as: :provisionable

  def provision
  end
end
