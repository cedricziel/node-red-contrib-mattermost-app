const helper = require("node-red-node-test-helper");
const apiNode = require("../mattermost-api.js");

describe("mattermost-api Node", function () {
  afterEach(function () {
    helper.unload();
  });

  it("should be loaded", function (done) {
    const flow = [{ id: "n1", type: "mattermost-api", name: "My API node" }];
    helper.load(apiNode, flow, function () {
      const n1 = helper.getNode("n1");
      try {
        n1.should.have.property("name", "My API node");

        done();
      } catch (err) {
        done(err);
      }
    });
  });
});
