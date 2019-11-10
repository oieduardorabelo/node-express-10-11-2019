let express = require("express");

let { createResponse, json2csv, json2xml } = require("../utils");

let users = require("../fixtures/users");

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
    "text/csv": () => json2csv([userRecord]),
    "application/xml": () => json2xml(userRecord),
    "application/json": () => userRecord
  };

  let [resType, resPayload] = await createResponse(payloads, payloadType);
  res.type(resType);
  res.send(resPayload);
};

let router = express.Router();
router.get("/", getUsers);
router.get("/:id", getUser);

module.exports = { router };
