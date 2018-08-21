describe Link do
  context "validation" do
    let(:link) { FactoryGirl.build(:link) }

    it "does not allow invalid urls" do
      [
        "foo.net",
        "www.foo.com",
        "foo.biz",
        "",
        "a_word",
        "http://a space.com",
        nil
      ].each do |url|
        link.url = url
        expect(link).not_to be_valid
      end
    end

    it "allows non-local urls" do
      [
        "http://foo.com",
        "https://foo.biz",
        "http://www.foo.net",
        "https://www.foo.com",
      ].each do |url|
        link.url = url
        expect(link).to be_valid
      end
    end

    it "allows local urls" do
      [
        "http://foo",
        "https://foo",
      ].each do |url|
        link.url = url
        expect(link).to be_valid
      end
    end
  end
end
