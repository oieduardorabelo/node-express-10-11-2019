let morgan = require('morgan');

let { ErrorPayloadNotFound, ErrorRecordNotFound } = require('./utils');

let logger = morgan('tiny');

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

module.exports = { logger, errorHandler };
