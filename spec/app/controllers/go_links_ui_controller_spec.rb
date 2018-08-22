describe GoLinksUiController, :type => :controller do
  it { should be_kind_of ApplicationController }

  context "show" do
    let(:link) { FactoryGirl.create(:link) }

    it "redirects to url of Link if alias exists and has no params" do
      get :show, params: { path: link.alias }
      expect(response).to redirect_to link.url
    end

    it "redirects to root_url if no alias exists by that name" do
      get :show, params: { path: link.alias + "blah" }
      expect(response).to redirect_to root_url
    end

    it "works as expected with params" do
      # get :show, params: { path: link.alias + "?query=foo" }
      # expect(response).to redirect_to(link.url + "?query=foo")

      # TODO: uhhhh what is this supposed to do?
    end

  end
end
