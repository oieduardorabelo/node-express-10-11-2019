let express = require("express");

let {
  generateId,
  createResponse,
  json2csv,
  json2xml,
  readBody
} = require("../utils");

let emails = require("../fixtures/emails");

let getEmails = async (req, res) => {
  createResponse(req, res, emails);
};
let getEmail = async (req, res) => {
  let targetId = req.params.id;
  let record = emails.find(item => item.id === targetId);
  createResponse(req, res, record);
};
let postEmail = async (req, res) => {
  let body = await readBody(req);
  let email = JSON.parse(body);
  email.id = generateId();
  emails.push(email);
  res.status(201).send(email);
};
let patchEmail = async (req, res) => {
  let body = await readBody(req);
  let email = emails.find(item => item.id === req.params.id);
  Object.assign(email, JSON.parse(body));
  res.status(200).send(email);
};
let destroyEmail = async (req, res) => {
  let targetIndex = emails.findIndex(item => item.id === req.params.id);
  let [email] = emails.splice(targetIndex, 1);
  res.status(200).send(email);
};

let router = express.Router();
router.get("/", getEmails);
router.post("/", postEmail);

router.get("/:id", getEmail);
router.patch("/:id", patchEmail);
router.delete("/:id", destroyEmail);

module.exports = { router };
