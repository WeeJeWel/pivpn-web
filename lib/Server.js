'use strict';

const path = require('path');

const express = require('express');
const debug = require('debug')('Server');

const PiVPNWireGuard = require('../services/PiVPNWireGuard');
const Util = require('./Util');

const {
  PORT,
} = require('../config');

module.exports = class Server {

  constructor() {
    this.app = express()
    .use('/', express.static(path.join(__dirname, '..', 'www')))
    .get('/api/wireguard/client', Util.promisify(async () => {
      return PiVPNWireGuard.getClients();
    }))
    .get('/api/wireguard/client-status', Util.promisify(async () => {
      return PiVPNWireGuard.getClientsStatus();
    }))
    .get('/api/wireguard/client/:name', Util.promisify(async req => {
      const { name } = req.params;
      return PiVPNWireGuard.getClient({ name });
    }))
    .get('/api/wireguard/client/:name/qrcode.svg', Util.promisify(async (req, res) => {
      const { name } = req.params;
      const svg = await PiVPNWireGuard.getClientQRCode({ name });
      res.header('Content-Type', 'image/svg+xml');
      res.send(svg);
    }))
    .post('/api/wireguard/client/:name', Util.promisify(async req => {
      const { name } = req.params;
      return PiVPNWireGuard.createClient({ name });
    }))
    .delete('/api/wireguard/client/:name', Util.promisify(async req => {
      const { name } = req.params;
      return PiVPNWireGuard.deleteClient({ name });
    }))
    .listen(PORT, () => {
      debug(`Listening on http://0.0.0.0:${PORT}`);
    })
  }

}