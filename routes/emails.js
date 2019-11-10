let express = require('express');

let middlewares = require('../middlewares');
let {
  createResponse,
  ErrorPayloadNotFound,
  ErrorRecordNotFound,
  generateId,
  json2csv,
  json2xml,
} = require('../utils');

let emails = require('../fixtures/emails');

let getEmails = async (req, res) => {
  createResponse(req, res, emails);
};
let getEmail = async (req, res) => {
  let targetId = req.params.id;
  let record = emails.find((item) => item.id === targetId);
  if (!record) {
    throw new ErrorRecordNotFound();
  }
  createResponse(req, res, record);
};
let postEmail = async (req, res) => {
  let email = req.body;
  if (!email) {
    throw new ErrorPayloadNotFound();
  }
  email.id = generateId();
  emails.push(email);
  res.status(201).send(email);
};
let patchEmail = async (req, res) => {
  let email = emails.find((item) => item.id === req.params.id);
  if (!email) {
    throw new ErrorRecordNotFound();
  }
  Object.assign(email, req.body);
  res.status(200).send(email);
};
let destroyEmail = async (req, res) => {
  let targetIndex = emails.findIndex((item) => item.id === req.params.id);
  if (targetIndex === -1) {
    throw new ErrorRecordNotFound();
  }
  let [email] = emails.splice(targetIndex, 1);
  res.status(200).send(email);
};

let router = express.Router();
router
  .route('/')
  .get(getEmails)
  .post(middlewares.jsonBodyParser, postEmail);

router
  .route('/:id')
  .get(getEmail)
  .patch(middlewares.jsonBodyParser, patchEmail)
  .delete(destroyEmail);

module.exports = { router };
