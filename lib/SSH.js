'use strict';

const debug = require('debug')('SSH');
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
    multiFactorAuthCode,
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
    this.multiFactorAuthCode = multiFactorAuthCode;
  }

  async connect() {
    debug(`Connecting to ${this.host}:${this.port}...`)

    if( this.multiFactorAuthCode ) {
      debug(`Connecting using MFA`);
      const password = this.password;
      const multiFactorAuthCode = this.multiFactorAuthCode;
      await this.ssh.connect({
        host: this.host,
        port: this.port,
        username: this.username,
        tryKeyboard: true,
        onKeyboardInteractive(name, instructions, instructionsLang, prompts, finish) {
          debug(`Received prompt: ${JSON.stringify(prompts)}`)
          if (prompts && prompts[0]?.prompt?.toLowerCase()?.includes('password')) {
            /* Send the password if prompted for Password */
            finish([password]);
          } else if (prompts && prompts[0]?.prompt?.toLowerCase()?.includes('verification code')) {
            /* Send the MFA Code if promprted for Verification code*/
            finish([multiFactorAuthCode]);
          }
        }
      });
    } else {
      debug(`Connecting using password`);
      await this.ssh.connect({
        host: this.host,
        port: this.port,
        username: this.username,
        password: this.password,
      });
    }
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
