let express = require("express");

let { createResponse, json2csv, json2xml } = require("../utils");

let emails = require("../fixtures/emails");

let getEmails = async (req, res) => {
  let formatters = {
    csv: async () => {
      let payload = await json2csv(emails);
      res.send(payload);
    },
    xml: () => {
      res.send(json2xml(emails));
    },
    json: () => {
      res.send(emails);
    },
    default: () => {
      let format = req.get("Accept");
      res.status(406).send(`Format type "${format}" is not acceptable.`);
    }
  };
  res.format(formatters);
};
let getEmail = async (req, res) => {
  let targetId = req.params.id;
  let record = emails.find(item => item.id === targetId);

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
router.get("/", getEmails);
router.get("/:id", getEmail);

module.exports = { router };
