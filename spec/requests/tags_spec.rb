require 'spec_helper'

describe 'Tags api' do
  describe 'GET index' do
    it 'returns all tags' do
      sign_in_as create(:staff)
      tags = ActsAsTaggableOn::Tag.create([{ name: 'this' }, { name: 'that' }])

      get tags_path

      expect(response).to be_success
      expect(response.body).to eq tags.to_json
    end
  end

  describe 'POST create' do
    it 'adds tags to the product' do
      sign_in_as create(:staff)
      product = create(:product)

      post product_tags_path(product), tag_list: %w(this that)

      expect(response).to be_success
      expect(product.reload.tag_list).to eq %w(this that)
    end
  end

  describe 'DELETE destroy' do
    it 'removes tags from the product' do
      sign_in_as create(:staff)
      product = create(:product, tag_list: %w(this that))

      delete product_tags_path(product), tag_list: %w(this that)

      expect(response).to be_success
      expect(product.reload.tag_list).to eq []
    end
  end
end
