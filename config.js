'use strict';

module.exports.PORT = process.env.PORT || 51821;
module.exports.SSH_HOST = process.env.SSH_HOST || '192.168.1.2';
module.exports.SSH_PORT = Number(process.env.SSH_PORT) || 22;