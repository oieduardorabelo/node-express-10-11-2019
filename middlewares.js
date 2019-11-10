let morgan = require('morgan');

let {
  readBody,
  ErrorPayloadNotFound,
  ErrorRecordNotFound,
} = require('./utils');

let logger = morgan('tiny');

let jsonBodyParser = (req, res, next) => {
  readBody(req).then((body) => {
    if (!body) {
      next(new ErrorPayloadNotFound());
    } else {
      req.body = JSON.parse(body);
      next();
    }
  });
};

let errorHandler = (error, req, res, next) => {
  switch (true) {
    case error instanceof ErrorPayloadNotFound: {
      res
        .status(400)
        .send({ ok: false, message: 'Missing body payload.', error });
      next();
      break;
    }
    case error instanceof ErrorRecordNotFound: {
      res.status(400).send({ ok: false, message: 'Record not found.', error });
      next();
      break;
    }
    default: {
      next(error);
    }
  }
};

module.exports = { logger, jsonBodyParser, errorHandler };
