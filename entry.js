let express = require('express');
let compression = require('compression');

let env = {
  PORT: 3000,
};

let middlewares = require('./middlewares');

let users = require('./routes/users');
let emails = require('./routes/emails');

let app = express();

app.use(compression({ threshold: 0 }));
app.use(middlewares.logger);

app.use('/users', users.router);
app.use('/emails', emails.router);

app.use(middlewares.errorHandler);

app.listen(env.PORT);
