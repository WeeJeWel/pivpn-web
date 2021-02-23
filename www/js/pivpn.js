'use strict';

class PiVPN {

  async call({ method, path, body }) {
    const res = await fetch(`/api${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body
        ? JSON.stringify(body)
        : undefined,
    });

    if( res.status === 204 )
      return undefined;
      
    const json = await res.json();

    if( !res.ok ) {
      throw new Error(json.error || res.statusText);
    }

    return json;
  }

  async getSession() {
    return this.call({
      method: 'get',
      path: '/session',
    });
  }

  async createSession({ username, password }) {
    return this.call({
      method: 'post',
      path: '/session',
      body: { username, password },
    });
  }

  async deleteSession() {
    return this.call({
      method: 'delete',
      path: '/session',
    });
  }

  async getWireGuardClients() {
    return this.call({
      method: 'get',
      path: '/wireguard/client',
    });
  }

  async getWireGuardClientsStatus() {
    return this.call({
      method: 'get',
      path: '/wireguard/client-status',
    });
  }

  async createWireGuardClient({ name }) {
    return this.call({
      method: 'post',
      path: `/wireguard/client/${name}`,
    });
  }

  async deleteWireGuardClient({ name }) {
    return this.call({
      method: 'delete',
      path: `/wireguard/client/${name}`,
    });
  }

  async enableWireGuardClient({ name }) {
    return this.call({
      method: 'post',
      path: `/wireguard/client/${name}/enable`,
    });
  }

  async disableWireGuardClient({ name }) {
    return this.call({
      method: 'post',
      path: `/wireguard/client/${name}/disable`,
    });
  }

}