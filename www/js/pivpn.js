'use strict';

class PiVPNWireGuard {

  async call({ method, path }) {
    const res = await fetch(`/api/wireguard${path}`, {
      method,
    });
    const json = await res.json();

    if( !res.ok ) {
      throw new Error(json.error || res.statusText);
    }

    return json;
  }

  async getClients() {
    return this.call({
      method: 'get',
      path: '/client',
    });
  }

  async getClientsStatus() {
    return this.call({
      method: 'get',
      path: '/client-status',
    });
  }

  async createClient({ name }) {
    return this.call({
      method: 'post',
      path: `/client/${name}`,
    });
  }

  async deleteClient({ name }) {
    return this.call({
      method: 'delete',
      path: `/client/${name}`,
    });
  }

}