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
let getUser = async (req, res) => {
  let userId = req.params.id;
  let userRecord = users.find(user => user.id === userId);

  let payloadType = req.get("Accept");
  let payloads = {
    "text/csv": () => json2csv(userRecord),
    "application/xml": () => json2xml(userRecord),
    "application/json": () => userRecord
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
let getEmail = async (req, res) => {
  let emailId = req.params.id;
  let emailRecord = emails.find(email => email.id === emailId);

  let payloadType = req.get("Accept");
  let payloads = {
    "text/csv": () => json2csv(emailRecord),
    "application/xml": () => json2xml(emailRecord),
    "application/json": () => emailRecord
  };

  let [resType, resPayload] = await createResponse(payloads, payloadType);
  res.type(resType);
  res.send(resPayload);
};

let router = express.Router();
router.get("/users", getUsers);
router.get("/users/:id", getUser);
router.get("/emails", getEmails);
router.get("/emails/:id", getEmail);
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
