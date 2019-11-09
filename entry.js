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

app.listen(env.PORT);

// # ####################
// routes and logic
// # ####################
let routes = {
  "GET /users": () => {
    return users;
  },
  "GET /emails": () => {
    return emails;
  }
};

function onCreateServer(req, res) {
  let route = `${req.method} ${req.url}`;

  switch (true) {
    case typeof routes[route] === "function": {
      res.send(routes[route]());
      break;
    }
    default: {
      res.send(`You asked for ${route}`);
    }
  }
}
