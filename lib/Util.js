'use strict';
module.exports = class Util {

  static promisify(fn) {
    return function(req, res) {
      Promise.resolve().then(async () => fn(req, res))
        .then(result => {
          if( res.headersSent ) return;

          if( typeof result === 'undefined' ) return res
            .status(204)
            .end();

          return res
            .status(200)
            .json(result);
        })
        .catch(error => {
          if( typeof error === 'string' ) {
            error = new Error(error);
          }
          
          return res
            .status(error.statusCode || 500)
            .json({
              error: error.message || error.toString(),
              stack: error.stack,
            });
        });
    }
  }

}