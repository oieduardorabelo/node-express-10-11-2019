let csv = require("csv");
let express = require("express");
let json2xml = require("json2xml");

let env = {
  PORT: 3000
};

let users = require("./fixtures/users");
let emails = require("./fixtures/emails");

// # ########################################
// express configuration
// # ########################################
let app = express();

app.listen(env.PORT);

// # ########################################
// routes and logic
// # ########################################
let getUsers = async (req, res) => {
  let payloadType = req.get("Accept");
  let payloads = {
    "text/csv": () => json2csv(users),
    "application/xml": () => json2xml(users),
    "application/json": () => users
  };

  let [resType, resPayload] = await createResponse(payloads, payloadType);
  res.type(resType);
  res.send(resPayload);
};
let getEmails = async (req, res) => {
  let payloadType = req.get("Accept");
  let payloads = {
    "text/csv": () => json2csv(emails),
    "application/xml": () => json2xml(emails),
    "application/json": () => emails
  };

  let [resType, resPayload] = await createResponse(payloads, payloadType);
  res.type(resType);
  res.send(resPayload);
};

let router = express.Router();
router.get("/users", getUsers);
router.get("/emails", getEmails);
app.use(router);

// # ########################################
// utils and helpers
// # ########################################
function json2csv(json) {
  return new Promise((res, rej) => {
    csv.stringify(json, (err, output) => {
      if (err) {
        rej(err);
      }
      res(output);
    });
  });
}

async function createResponse(payloads, payloadType) {
  if (payloads[payloadType]) {
    return [payloadType, await payloads[payloadType]()];
  }

  let defaultPayloadType = "application/json";
  return [defaultPayloadType, await payloads[defaultPayloadType]()];
}
