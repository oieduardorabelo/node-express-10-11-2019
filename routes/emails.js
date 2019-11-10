let express = require('express');
let bodyParser = require('body-parser');

let jsonBodyParser = bodyParser.json({
  limit: '100kb',
});

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

let getEmails = (req, res, next) => {
  createResponse(req, res, next, emails);
};
let getEmail = (req, res, next) => {
  let targetId = req.params.id;
  let record = emails.find((item) => item.id === targetId);
  if (!record) {
    throw new ErrorRecordNotFound();
  }
  createResponse(req, res, next, record);
};
let postEmail = (req, res) => {
  let email = req.body;
  email.id = generateId();
  emails.push(email);
  res.status(201).send(email);
};
let patchEmail = (req, res) => {
  let email = emails.find((item) => item.id === req.params.id);
  if (!email) {
    throw new ErrorRecordNotFound();
  }
  Object.assign(email, req.body);
  res.status(200).send(email);
};
let destroyEmail = (req, res) => {
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
  .post(jsonBodyParser, postEmail);

router
  .route('/:id')
  .get(getEmail)
  .patch(jsonBodyParser, patchEmail)
  .delete(destroyEmail);

module.exports = { router };
