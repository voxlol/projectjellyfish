FactoryGirl.define do
  factory :content_page do
    sequence :title do |n|
      "Content Page Title #{n}"
    end

    sequence :slug do |n|
      "Content-Page-Title-#{n}"
    end
  end
end
