FactoryGirl.define do
  factory :link do
    created_at Time.now
    updated_at Time.now
    sequence(:owner) { |i| "owner_#{i}" }
    sequence(:url) { |i| "http://url_#{i}.com" }
    sequence(:alias) { |i| "alias-#{i}" }
  end
end
