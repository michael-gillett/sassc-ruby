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

    it "deleting links removes them from result" do
      link4.delete
      get :index
      expect(JSON.parse response.body).to contain_exactly(
        *[ link1, link2, link3 ].map(&:as_json)
      )
    end
  end

  context "create" do
    let(:url) { "http://test.com" }
    let(:alias_) { "an_alias" }
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
          "alias" => "an-alias",
          "url"=> url,
          "owner" => expected_owner,
          "description" => desc
        )
      end

      it "redirects to root" do
        expect(JSON.parse response.body).to include("redirect_to" => "/")
      end

      it "persists the link" do
        expect(
          Link.pluck(:alias, :url, :owner, :description)
        ).to include [ "an-alias", url, expected_owner, desc ]
      end
    end

    shared_examples_for "failing to create without all required parameters" do
      let(:params) { { owner: specified_owner, url: url, alias: alias_ } }
      [ :url, :alias, :owner ].each do |param_sym|
        it "fails when not given #{param_sym}" do
          post :create, params: params.except(param_sym)
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

      it_behaves_like "failing to create without all required parameters"
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

      it_behaves_like "failing to create without all required parameters"
    end
  end

  context "update" do
    let!(:link) { FactoryGirl.create(:link, owner: non_admin_active_user) }
    let(:url) { link.url + ".com" }
    let(:alias_) { link.alias + "foo" }
    let(:specified_owner) { "lol_" + link.owner }
    let(:desc) { "abc" * 1000 }

    shared_examples_for "updating successfully" do
      let(:params) {
        params = {
          id: link.id,
          url: url,
          owner: specified_owner,
          alias: alias_,
          description: desc
        }
      }

      before(:each) {
        post :update, params: params
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

      it "persists the update" do
        expect(Link.find(link.id).as_json).to include(
          "alias" => alias_,
          "url" => url,
          "owner" => expected_owner,
          "description" => desc
        )
      end
    end

    shared_examples_for "failing to update" do
      let(:params) {
        {
          id: link.id + 1,
          owner: specified_owner,
          url: url,
          alias: alias_,
        }
      }

      it "fails if link id not found" do
        post :update, params: params
        assert_response :error
      end

      it "fails if active_user is not an owner or an admin" do
        controller.instance_variable_set :@active_user, non_admin_active_user + ".tz"
        post :update, params: params.merge(id: link.id)
        assert_response :forbidden
      end
    end

    context "non-admin active_user" do
      let(:expected_owner) { non_admin_active_user }
      it_behaves_like "updating successfully"
      it_behaves_like "failing to update"
    end

    context "admin active_user" do
      before(:each) {
        controller.instance_variable_set :@active_user, admin_active_user
      }
      let(:expected_owner) { specified_owner }
      it_behaves_like "updating successfully"
      it_behaves_like "failing to update"
    end
  end

  context "destroy" do
    let!(:link) { FactoryGirl.create(:link, owner: non_admin_active_user + ".tz") }

    it "fails to delete a link that doesn't exist" do
      post :destroy, params: { id: link.id + 1 }
      assert_response :error
    end

    it "returns forbidden if link is not owned by active_user" do
      post :destroy, params: { id: link.id }
      assert_response :forbidden
    end

    describe "non admin active user deleting own link" do
      before(:each) {
        link.update!(owner: non_admin_active_user)
        post :destroy, params: { id: link.id }
      }

      it "succeeds" do
        assert_response :success
      end

      it "link no longer exists" do
        expect(Link.all).to be_empty
      end
    end

    describe "admin active user deleting any link" do
      before(:each) {
        controller.instance_variable_set :@active_user, admin_active_user
        post :destroy, params: { id: link.id }
      }

      it "succeeds" do
        assert_response :success
      end

      it "link no longer exists" do
        expect(Link.all).to be_empty
      end
    end
  end

end
