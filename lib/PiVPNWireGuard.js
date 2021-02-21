'use strict';

const qrcode = require('qrcode');

const Util = require('./Util');

const shellParser = require('node-shell-parser');

module.exports = class PiVPNWireGuard {

  async getClients() {
    const stdout = await Util.exec('sudo cat /etc/wireguard/configs/clients.txt');
    return stdout
      .trim()
      .split('\n')
      .filter(line => {
        return line.length > 0;
      })
      .map(line => {
        const [ name, publicKey, createdAt ] = line.split(' ');
        return {
          name,
          publicKey,
          createdAt: new Date(Number(createdAt + '000')),
        };
      });
  }

  async getClientsStatus() {
    const clients = await this.getClients();
    const stdout = await Util.exec('sudo wg show all dump');

    return stdout
      .trim()
      .split('\n')
      .slice(1)
      .map(line => {
        const [
          iface,
          publicKey,
          preSharedKey,
          endpoint,
          allowedIps,
          latestHandshake,
          transferRx,
          transferTx,
          persistentKeepalive,          
        ] = line.split('\t');

        const client = clients.find(client => client.publicKey === publicKey);
        return {
          ...client,
          iface,
          preSharedKey,
          endpoint,
          allowedIps,
          latestHandshake,
          transferRx,
          transferTx,
          persistentKeepalive, 
        };
      })
  }

  async getClient({ name }) {
    const clients = await this.getClients();
    const client = clients.find(client => client.name === name);

    if( !client ) {
      throw new Error(`Invalid Client: ${name}`);
    }

    return client;
  }
  
  async getClientConfiguration({ name }) {
    await this.getClient({ name });
    const stdout = await Util.exec(`sudo cat /etc/wireguard/configs/${name}.conf`);
    return stdout;
  }

  async getClientQRCodeSVG({ name }) {
    const configuration = await this.getClientConfiguration({ name });
    return qrcode.toString(configuration, {
      type: 'svg',
      width: 512,
    });
  }

  async createClient({ name }) {
    if( !name ) {
      throw new Error('Missing: Name');
    }

    try {
      await this.getClient({ name });
      throw new Error(`Duplicate Client: ${name}`);
    } catch( err ) {
      if( err.message.startsWith('Duplicate Client') ) {
        throw err;
      }
    }

    // TODO: This is unsafe
    await Util.exec(`pivpn add -n ${name}`);

    return this.getClient({ name });
  }

  async deleteClient({ name }) {
    if( !name ) {
      throw new Error('Missing: Name');
    }

    await this.getClient({ name });
    await Util.exec(`pivpn remove ${name} --yes`);
  }

}