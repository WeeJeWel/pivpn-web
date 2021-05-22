# PiVPN Web

[![Build & Publish Docker Image to Docker Hub](https://github.com/WeeJeWel/pivpn-web/actions/workflows/deploy.yml/badge.svg?branch=production)](https://github.com/WeeJeWel/pivpn-web/actions/workflows/deploy.yml)
[![Docker](https://img.shields.io/docker/v/weejewel/pivpn-web/latest)](https://hub.docker.com/r/weejewel/pivpn-web)
[![Docker](https://img.shields.io/docker/pulls/weejewel/pivpn-web.svg)](https://hub.docker.com/r/weejewel/pivpn-web)
[![Sponsor](https://img.shields.io/github/sponsors/weejewel)](https://github.com/sponsors/WeeJeWel)


PiVPN Web is an open-source Web UI for PiVPN (when using WireGuard).

![](https://i.imgur.com/eUTtYWx.png)

## Features

* A beautiful & easy to use UI
* Easy installation: just one command
* List, create, delete, enable & disable users
* Show a user's QR code
* Download a user's configuration file
* See which users are connected
* Log in with your Linux username & password
* Connects to your local PiVPN installation — or remote over SSH
* Gravatar support 😏

## Requirements

* Docker installed
* PiVPN installed (WireGuard, not OpenVPN)
* SSH enabled

## Installation

### 1. Install Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user 'pi' to group 'docker'
sudo usermod -aG docker pi
```

### 2. Install PiVPN

```bash
curl -L https://install.pivpn.io | bash
```

> See [https://pivpn.io](https://pivpn.io) for detailed instructions.

### 3. Install PiVPN Web

Run this command once to automatically start the service on boot.

```bash
docker run -d -p 51821:51821 --name pivpn-web --restart=unless-stopped weejewel/pivpn-web
```

> 💡 Remove the `restart=always` flag to prevent auto-start on boot.

> 💡 You can set the environment variable `SSH_HOST` to a hostname/IP to connect to a different PiVPN server than PiVPN Web is running on.

> 💡 There's also a [`docker-compose.yml`](https://github.com/WeeJeWel/pivpn-web/blob/master/docker-compose.yml) file.

## Usage

Open `http://<ip-of-your-pi>:51821` and log in with your Raspberry Pi username & password.

> 💡 The default Raspbian username is `pi` and the default password is `raspberry`.

> 💡 When a client's name is a valid Gravatar e-mail, they will be shown with their avatar.

## Supported environment variables
| Variable   | Default    | Comment                             |
|:-----------|:--------   |:------------------------------------|
| PORT       | 51821      | The listening port (number)         |
| SSH_HOST   | 172.17.0.1 | The SSH host to connect to (ip)     |
| SSH_PORT   | 22         | The SSH port to connect to (number) |
| ENABLE_2FA | no         | Enable 2FA login support (yes/no)   |

## Updating

Run these commands to update to the latest version.

```bash
docker stop pivpn-web
docker rm pivpn-web
docker pull weejewel/pivpn-web
docker run -d -p 51821:51821 --name pivpn-web --restart=unless-stopped weejewel/pivpn-web
```
