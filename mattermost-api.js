module.exports = function (RED) {
  const handle_error = function (err, node) {
    console.error(err);
    node.status({
      fill: "red",
      shape: "dot",
      text: err.message,
    });
    node.error(err.message);
  };

  function MattermostAPINode(config) {
    RED.nodes.createNode(this, config);

    let node = this;
    node.host = RED.nodes.getNode(config.host);

    //handle message in
    node.on("input", async function (msg, send, done) {
      const client = await node.host.createClient();

      const isConnected = await client.isConnected();
      if (!isConnected) {
        done();

        return handle_error(new Error("Error logging in!"), node);
      }

      if (client[msg.method]) {
        if (!msg.args) {
          msg.payload = null;

          handle_error(new Error(`Missing arguments for ${msg.method}`), node);

          done();

          return false;
        }

        node.status({
          fill: "blue",
          shape: "dot",
          text: `Calling ${msg.method}`,
        });

        client[msg.method](...msg.args)
          .then((data) => {
            msg.payload = data || false;

            node.status({
              fill: "green",
              shape: "dot",
              text: `${msg.method}`,
            });

            send(msg);
          })
          .catch((err) => {
            handle_error(err, node);

            done();
          });
      } else {
        return handle_error(
          new Error(`Method not supported ${msg.method ?? "undefined"}`),
          node,
        );
      }
    });
  }

  RED.nodes.registerType("mattermost-api", MattermostAPINode);
};
