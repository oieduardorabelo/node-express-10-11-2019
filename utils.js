let crypto = require('crypto');
let csv = require('csv');
let json2xml = require('json2xml');

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

function createResponse(req, res, next, payload) {
  let formatters = {
    json: () => {
      res.send(payload);
      next();
    },
    csv: () => {
      json2csv(payload)
        .then((resultCsv) => {
          res.send(resultCsv);
          next();
        })
        .catch((err) => {
          next(err);
        });
    },
    xml: () => {
      res.send(json2xml(payload));
      next();
    },
    default: () => {
      let format = req.get('Accept');
      res.status(406).send(`Format type "${format}" is not acceptable.`);
      next();
    },
  };
  res.format(formatters);
}

function readBody(req) {
  return new Promise((res, rej) => {
    let chunks = [];
    req.on('data', (chunk) => {
      chunks.push(chunk);
    });
    req.on('end', () => {
      let result = Buffer.concat(chunks);
      res(result.toString());
    });
    req.on('error', (err) => {
      rej(err);
    });
  });
}

function generateId() {
  return crypto.randomBytes(8).toString('hex');
}

class ErrorRecordNotFound extends Error {
  constructor(message) {
    super(message);
    this.name = 'ERROR_100_RECORD_NOT_FOUND';
  }
}

class ErrorPayloadNotFound extends Error {
  constructor(message) {
    super(message);
    this.name = 'ERROR_110_PAYLOAD_NOT_FOUND';
  }
}

module.exports = {
  json2csv,
  json2xml,
  createResponse,
  readBody,
  generateId,
  ErrorRecordNotFound,
  ErrorPayloadNotFound,
};
