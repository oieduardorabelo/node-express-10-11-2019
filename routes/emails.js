let express = require("express");

let { createResponse, json2csv, json2xml } = require("../utils");

let emails = require("../fixtures/emails");

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
    "text/csv": () => json2csv([emailRecord]),
    "application/xml": () => json2xml(emailRecord),
    "application/json": () => emailRecord
  };

  let [resType, resPayload] = await createResponse(payloads, payloadType);
  res.type(resType);
  res.send(resPayload);
};

let router = express.Router();
router.get("/", getEmails);
router.get("/:id", getEmail);

module.exports = { router };
