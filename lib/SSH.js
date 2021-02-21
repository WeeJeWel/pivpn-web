'use strict';

const { NodeSSH } = require('node-ssh');

const {
  SSH_PORT,
  SSH_HOST,
} = require('../config');

module.exports = class SSH {

  constructor({
    host = SSH_HOST,
    port = SSH_PORT,
    username,
    password,
  }) {
    if( !host ) {
      throw new Error('Missing: Host');
    }

    if( !port ) {
      throw new Error('Missing: Port');
    }

    if( !username ) {
      throw new Error('Missing: Username');
    }

    if( !password ) {
      throw new Error('Missing: Password');
    }

    this.ssh = new NodeSSH();
    this.host = host;
    this.port = port;
    this.username = username;
    this.password = password;
  }

  async connect() {
    await this.ssh.connect({
      host: this.host,
      port: this.port,
      username: this.username,
      password: this.password,
    });
  }

  async exec(command) {
    const {
      stdout,
      stderr,
    } = await this.ssh.execCommand(command);

    return {
      stdout,
      stderr,
    };
  }

  destroy() {
    this.ssh.dispose();
  }

}