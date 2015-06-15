describe 'routing' do
  it 'routes to glob urls' do
    expect(get: '/admin/test').to route_to(
      controller: 'welcome',
      action: 'index',
      path: 'test'
    )
  end

  describe 'checks if page exists' do
    before :each do
      allow(Rails).to receive(:env).and_return(ActiveSupport::StringInquirer.new('production'))
    end

    it 'should give a 404' do
      expect(get: '/this_page_does_not_exist').not_to be_routable
    end

    it 'should not give a 404' do
      expect(get: '/').to be_routable
    end
  end
end
