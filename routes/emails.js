let express = require("express");

let { createResponse, json2csv, json2xml } = require("../utils");

let emails = require("../fixtures/emails");

let getEmails = async (req, res) => {
  createResponse(req, res, emails);
};
let getEmail = async (req, res) => {
  let targetId = req.params.id;
  let record = emails.find(item => item.id === targetId);
  createResponse(req, res, record);
};

let router = express.Router();
router.get("/", getEmails);
router.get("/:id", getEmail);

module.exports = { router };
