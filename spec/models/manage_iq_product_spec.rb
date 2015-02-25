# == Schema Information
#
# Table name: manage_iq_products
#
#  id                 :integer          not null, primary key
#  created_at         :datetime
#  updated_at         :datetime
#  service_type_id    :integer
#  service_catalog_id :integer
#  chef_role          :string(100)
#  options            :json
#  cloud_id           :integer
#

describe ManageIqProduct do
  it { should have_one(:product) }
  it { should belong_to(:cloud) }

  describe '#provision' do
    it 'creates an instance of the ProvisionWorker class' do
      product = build(:manage_iq_product)
      allow(ProvisionWorker).to receive(:new)

      product.provision(1)

      expect(ProvisionWorker).to have_received(:new).with(1)
    end
  end

  describe '#options' do
    it 'can store unstructured options' do
      options = [{ dialog_name: 'name' }, { dialog_name: 'name2' }]

      product = create(:manage_iq_product, options: options)
      expect(product.options[0][:dialog_name]).to eq(options[0]['dialog_name'])
      expect(product.options[1][:dialog_name]).to eq(options[1]['dialog_name'])
    end
  end
end
