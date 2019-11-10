let { readBody } = require("./utils");

let logger = (req, res, next) => {
  let route = `${req.method} ${req.url}`;
  console.log(route);
  next();
};

let jsonBodyParser = async (req, res, next) => {
  let body = await readBody(req);
  req.body = JSON.parse(body);
  next();
};

module.exports = { logger, jsonBodyParser };
