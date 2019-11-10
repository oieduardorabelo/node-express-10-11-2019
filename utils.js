let crypto = require("crypto");
let csv = require("csv");
let json2xml = require("json2xml");

function json2csv(json) {
  return new Promise((res, rej) => {
    let payload = json;

    if (Array.isArray(json) === false) {
      payload = [json];
    }

    csv.stringify(payload, (err, output) => {
      if (err) {
        rej(err);
      } else {
        res(output);
      }
    });
  });
}

async function createResponse(req, res, payload) {
  let formatters = {
    json: () => {
      res.send(payload);
    },
    csv: async () => {
      let resultCsv = await json2csv(payload);
      res.send(resultCsv);
    },
    xml: () => {
      res.send(json2xml(payload));
    },
    default: () => {
      let format = req.get("Accept");
      res.status(406).send(`Format type "${format}" is not acceptable.`);
    }
  };
  res.format(formatters);
}

function readBody(req) {
  return new Promise((res, rej) => {
    let chunks = [];
    req.on("data", chunk => {
      chunks.push(chunk);
    });
    req.on("end", () => {
      res(Buffer.concat(chunks));
    });
    req.on("error", err => {
      rej(err);
    });
  });
}

function generateId() {
  return crypto.randomBytes(8).toString("hex");
}

module.exports = { json2csv, json2xml, createResponse, readBody, generateId };
