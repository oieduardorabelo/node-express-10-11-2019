let express = require("express");

let env = {
  PORT: 3000
};

// # ########################################
// routes and logic
// # ########################################
let users = require("./routes/users");
let emails = require("./routes/emails");

// # ########################################
// express configuration
// # ########################################
let app = express();

app.use("/users", users.router);
app.use("/emails", emails.router);

app.listen(env.PORT);
