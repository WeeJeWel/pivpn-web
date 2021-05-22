'use strict';

module.exports.PORT = process.env.PORT || 51821;
module.exports.SSH_HOST = process.env.SSH_HOST || '172.17.0.1';
module.exports.SSH_PORT = Number(process.env.SSH_PORT) || 22;
module.exports.ENABLE_2FA = process.env?.ENABLE_2FA?.toLowerCase() === 'yes' ? true : false;
