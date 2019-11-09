let csv = require("csv");
let express = require("express");
let json2xml = require("json2xml");

let env = {
  PORT: 3000
};

let users = require("./fixtures/users");
let emails = require("./fixtures/emails");

// # ########################################
// express configuration
// # ########################################
let app = express();

app.use(onCreateServer);

app.listen(env.PORT);

// # ########################################
// routes and logic
// # ########################################
let routes = {
  "GET /users": async req => {
    let payloadType = req.get("Accept");
    let payloads = {
      "text/csv": () => json2csv(users),
      "application/xml": () => json2xml(users),
      "application/json": () => users
    };

    let result = await createPayloadResponseType(payloads, payloadType);
    return result;
  },
  "GET /emails": async req => {
    let payloadType = req.get("Accept");
    let payloads = {
      "text/csv": () => json2csv(emails),
      "application/xml": () => json2xml(emails),
      "application/json": () => emails
    };

    let result = await createPayloadResponseType(payloads, payloadType);
    return result;
  }
};

// # ########################################
// utils and helpers
// # ########################################
async function onCreateServer(req, res) {
  let route = `${req.method} ${req.url}`;

  switch (true) {
    case typeof routes[route] === "function": {
      let [resType, resPayload] = await routes[route](req);
      res.type(resType);
      res.send(resPayload);
      break;
    }
    default: {
      res.send(`You asked for ${route}`);
    }
  }
}

function json2csv(json) {
  return new Promise((res, rej) => {
    csv.stringify(json, (err, output) => {
      if (err) {
        rej(err);
      }
      res(output);
    });
  });
}

async function createPayloadResponseType(payloads, payloadType) {
  if (payloads[payloadType]) {
    return [payloadType, await payloads[payloadType]()];
  }

  let defaultPayloadType = "application/json";
  return [defaultPayloadType, await payloads[defaultPayloadType]()];
}
