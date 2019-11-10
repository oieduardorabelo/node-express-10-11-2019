let csv = require("csv");
let json2xml = require("json2xml");

// # ########################################
// utils and helpers
// # ########################################
function json2csv(json) {
  return new Promise((res, rej) => {
    csv.stringify(json, (err, output) => {
      if (err) {
        rej(err);
      } else {
        res(output);
      }
    });
  });
}

async function createResponse(payloads, payloadType) {
  if (payloads[payloadType]) {
    console.log(payloadType, payloads[payloadType]);
    return [payloadType, await payloads[payloadType]()];
  }

  let defaultPayloadType = "application/json";
  return [defaultPayloadType, await payloads[defaultPayloadType]()];
}

module.exports = { json2csv, json2xml, createResponse };
