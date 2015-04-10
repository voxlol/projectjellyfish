describe 'routing' do
  it 'routes to glob urls' do
    expect(get: '/admin/test').to route_to(
      controller: 'welcome',
      action: 'index',
      path: 'test'
    )
  end
end
