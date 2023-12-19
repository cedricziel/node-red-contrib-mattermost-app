module.exports = function (RED) {
  function MattermostConfigNode(n) {
    RED.nodes.createNode(this, n);

    let node = this;
    node.name = n.name;
    node.url = n.url;
    node.team = n.team;
    node.wssPort = n.wssPort;
    node.httpPort = n.httpPort;
    node.defaultChannel = n.defaultChannel;
    /**
     * @type {mattermost.Client4}
     */
    node.client = null;
    node.error = undefined;

    node.username = node.credentials.username || "";
    node.password = node.credentials.password || "";
    node.access_token = node.credentials.access_token || "";

    const mattermost = require("@mattermost/client");

    node.on("close", function (done) {
      console.log("closing node mattermost-config");
      node.client = null;
      // reset error on deploy
      node.error = undefined;

      done();
    });

    node.createClient = async function () {
      //create client
      node.client = new mattermost.Client4();
      node.client.setUrl(node.url);

      if (node.username && node.password) {
        await node.client.login(node.username, node.password);
      } else if (node.access_token) {
        node.client.setToken(node.credentials.access_token);
      }

      node.client.isConnected = async function () {
        return await node.client.ping();
      };

      node.client.getFileById = function (fileID = false) {
        if (!fileID) return false;

        const uri = `/files/${fileID}`;
        const uriInfo = `/files/${fileID}/info`;
        return new Promise((res, rej) => {
          node.client._apiCall("GET", uriInfo, [], (dataInfo, headersInfo) => {
            node.client.logger.debug("Received File Info");

            node.client._apiCall(
              "GET",
              uri,
              [],
              (data, headers) => {
                node.client.logger.debug("Received File");
                var tmpFileName = dataInfo.id; //moment('X');
                var tmpFilePath = `/data/${tmpFileName}.${dataInfo.extension}`;

                fs.writeFile(tmpFilePath, data, "binary", function (err) {
                  if (err) {
                    rej(err);
                  } else {
                    fetch
                      .local(tmpFilePath)
                      .then((data) => {
                        // data[0] contains the raw base64-encoded jpg
                        res({
                          meta: dataInfo,
                          fileBase64: data[0],
                          fileBuffer: data,
                        });
                      })
                      .catch((reason) => {
                        rej(reason);
                      });
                  }
                });
              },
              {},
              {
                encoding: null,
              },
            );
          });
        });
      };

      return node.client;
    };
  }

  RED.nodes.registerType("mattermost-config", MattermostConfigNode, {
    credentials: {
      username: { type: "text" },
      password: { type: "password" },
      access_token: { type: "text" },
    },
  });
};
