describe GoLinksUiController, :type => :controller do
  it { should be_kind_of ApplicationController }

  context "show" do
    let(:original_url) { "http://foo.com" }
    let(:link) { FactoryGirl.create(:link, url: original_url) }

    it "redirects to url of Link if alias exists and has no params" do
      get :show, params: { path: link.alias }
      expect(response).to redirect_to link.url
    end

    it "redirects to root_url if no alias exists by that name" do
      get :show, params: { path: link.alias + "blah" }
      expect(response).to redirect_to root_url
    end

    describe "works as expected with params" do
      let(:param_url) { link.url + "/<param>/blah/<param>" }
      before(:each) { link.update!(url: param_url) }

      it "fails with too few params" do
        get :show, params: { path: link.alias + "/a_thing" }
        assert_response :bad_request
      end

      it "fails with too many params" do
        get :show, params: { path: link.alias + "/a_thing/bhhahaha/jkjk" }
        assert_response :bad_request
      end

      it "succeeds in redirect with correct params" do
        get :show, params: { path: link.alias + "/a_thing/another_thing" }
        expect(
          response
        ).to redirect_to(original_url + "/a_thing/blah/another_thing")
      end
    end

  end
end
