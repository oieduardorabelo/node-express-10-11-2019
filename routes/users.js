let express = require("express");

let { createResponse, json2csv, json2xml } = require("../utils");

let users = require("../fixtures/users");

let getUsers = async (req, res) => {
  let formatters = {
    csv: async () => {
      let payload = await json2csv(users);
      res.send(payload);
    },
    xml: () => {
      res.send(json2xml(users));
    },
    json: () => {
      res.send(users);
    },
    default: () => {
      let format = req.get("Accept");
      res.status(406).send(`Format type "${format}" is not acceptable.`);
    }
  };
  res.format(formatters);
};
let getUser = async (req, res) => {
  let targetId = req.params.id;
  let record = users.find(item => item.id === targetId);

  let formatters = {
    csv: async () => {
      let payload = await json2csv([record]);
      res.send(payload);
    },
    xml: () => {
      res.send(json2xml(record));
    },
    json: () => {
      res.send(record);
    },
    default: () => {
      let format = req.get("Accept");
      res.status(406).send(`Format type "${format}" is not acceptable.`);
    }
  };
  res.format(formatters);
};

let router = express.Router();
router.get("/", getUsers);
router.get("/:id", getUser);

module.exports = { router };
