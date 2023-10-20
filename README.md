# l402-demo

This repo contains a demo usage of Lightning Lab's [Aperture](https://github.com/lightninglabs/aperture) L402 reverse proxy. It is made up of three parts:
- Aperture reverse proxy
- Simple web service
- A simple React web app (a modified version of the [lnc-web connect-demo app](https://github.com/lightninglabs/lnc-web/tree/main/demos/connect-demo))

## Prerequisites

- Docker Compose
- Node.js
- A receiving LND node capable of Lightning Node Connect
- A sending LND node capable of Lightning Node Connect

## Running the demo 

First, create a `.env` file in the repo root containing the hostname of service's node:
```
LNDHOST=example.t.voltageapp.io:10009
```

Then, get the TLS certificate and admin macaroon for the service's node. Place the TLS cert at `./aperture/lnd/tls.cert`. Place the macaroon inside `./aperture/lnd/data/chain/bitcoin/testnet`.

To start the web service and reverse proxy, run
```shell
docker compose up --build
```

To start the web app, run

```shell
cd client
yarn install
yarn start
```

Point your browser to `localhost:3000` and enter the LNC pairing phrase of the client's node.
