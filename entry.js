let http = require("http");
let express = require("express");

let env = {
  PORT: 3000
};

let users = require("./fixtures/users");
let emails = require("./fixtures/emails");

// # ####################
// express configuration
// # ####################
let app = express();
app.use(onCreateServer);

// # ####################
// server configuration
// # ####################
let server = http.createServer(app);
server.listen(env.PORT);

// # ####################
// routes and logic
// # ####################
let routes = {
  "GET /users": () => {
    return JSON.stringify(users);
  },
  "GET /emails": () => {
    return JSON.stringify(emails);
  }
};

function onCreateServer(req, res) {
  let route = `${req.method} ${req.url}`;

  switch (true) {
    case typeof routes[route] === "function": {
      res.end(routes[route]());
      break;
    }
    default: {
      res.end(`You asked for ${route}`);
    }
  }
}
