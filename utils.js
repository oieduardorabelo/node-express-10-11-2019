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
    csv: async () => {
      let resultCsv = await json2csv(payload);
      res.send(resultCsv);
    },
    xml: () => {
      res.send(json2xml(payload));
    },
    json: () => {
      res.send(payload);
    },
    default: () => {
      let format = req.get("Accept");
      res.status(406).send(`Format type "${format}" is not acceptable.`);
    }
  };
  res.format(formatters);
}

module.exports = { json2csv, json2xml, createResponse };
