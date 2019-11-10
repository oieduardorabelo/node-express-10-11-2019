let express = require("express");

let { createResponse, json2csv, json2xml } = require("../utils");

let users = require("../fixtures/users");

let getUsers = async (req, res) => {
  createResponse(req, res, users);
};
let getUser = async (req, res) => {
  let targetId = req.params.id;
  let record = users.find(item => item.id === targetId);
  createResponse(req, res, record);
};

let router = express.Router();
router.get("/", getUsers);
router.get("/:id", getUser);

module.exports = { router };
