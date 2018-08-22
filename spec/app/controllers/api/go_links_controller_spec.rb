describe Api::GoLinksController, :type => :controller do
  it { should be_kind_of ApplicationController }

  let(:non_admin_active_user) { "non_admin@blah.biz" }
  let(:admin_active_user) { ApplicationController::ADMIN_USERS.first }

  before(:each) {
    allow(controller).to receive :init_active_user
    controller.instance_variable_set :@active_user, non_admin_active_user
  }

  context "index" do
    [ :link1, :link2, :link3, :link4 ].each do |l|
      let!(l) { FactoryGirl.create(:link) }
    end

    before(:each) { get :index }

    it 'should return success status' do
      assert_response :success
    end

    it "should return all links" do
      expect(JSON.parse response.body).to contain_exactly(
        *[ link1, link2, link3, link4 ].map(&:as_json)
      )

      # verifying nothing fishy
      expect(JSON.parse response.body).to contain_exactly(
        *Link.all.map(&:as_json)
      )
    end

    it "links should be returned with all necessary attributes" do
      JSON.parse(response.body).each do |link|
        expect(link).to include "id", "alias", "url", "owner", "description"
      end
    end
  end

  context "create" do
    let(:url) { "http://test.com" }
    let(:alias_) { "an-alias" }
    let(:specified_owner) { "an_owner@owner.com" }
    let(:desc) { nil }

    shared_examples_for "creating successfully" do
      let(:params) {
        params = { url: url, owner: specified_owner, alias: alias_, description: desc }
        desc.nil? ? params.except(:description) : params
      }
      before(:each) {
        post :create, params: params
      }

      it "succeeds" do
        assert_response :success
      end

      it "includes correct go_link in response object" do
        expect(JSON.parse(response.body)["go_link"]).to include(
          "alias" => alias_,
          "url"=> url,
          "owner" => expected_owner,
          "description" => desc
        )
      end

      it "redirects to root" do
        expect(JSON.parse response.body).to include("redirect_to" => "/")
      end
    end

    shared_examples_for "failing without all required parameters" do
      let(:base_params) { { owner: specified_owner, url: url, alias: alias_ } }
      [ :url, :alias, :owner ].each do |param_sym|
        it "fails when not given #{param_sym}" do
          post :create, params: base_params.except(param_sym)
          assert_response :error
        end
      end
    end

    context "non-admin active_user" do
      let(:expected_owner) { non_admin_active_user }

      describe "given required params but no description" do
        let(:desc) { nil }
        it_behaves_like "creating successfully"
      end

      describe "given required params and a description" do
        let(:desc) { "abc" * 1000 }
        it_behaves_like "creating successfully"
      end

      it_behaves_like "failing without all required parameters"
    end

    context "admin active_user" do
      before(:each) {
        controller.instance_variable_set :@active_user, admin_active_user
      }
      let(:expected_owner) { specified_owner }

      describe "given required params but no description" do
        let(:desc) { nil }
        it_behaves_like "creating successfully"
      end

      describe "given required params and a description" do
        let(:desc) { "abc" * 1000 }
        it_behaves_like "creating successfully"
      end

      it_behaves_like "failing without all required parameters"
    end
  end

end
