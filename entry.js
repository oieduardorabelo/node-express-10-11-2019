let express = require("express");

let env = {
  PORT: 3000
};

let users = require("./routes/users");
let emails = require("./routes/users");

// # ########################################
// express configuration
// # ########################################
let app = express();

app.listen(env.PORT);

// # ########################################
// routes and logic
// # ########################################
app.use("/users", users.router);
app.use("/emails", emails.router);
