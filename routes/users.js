let express = require('express');

let {
  createResponse,
  ErrorPayloadNotFound,
  ErrorRecordNotFound,
  json2csv,
  json2xml,
} = require('../utils');

let users = require('../fixtures/users');

let getUsers = (req, res, next) => {
  createResponse(req, res, next, users);
};
let getUser = (req, res, next) => {
  let targetId = req.params.id;
  let record = users.find((item) => item.id === targetId);
  if (!record) {
    throw new ErrorRecordNotFound();
  }
  createResponse(req, res, next, record);
};

let router = express.Router();

router.route('/').get(getUsers);

router.route('/:id').get(getUser);

module.exports = { router };
