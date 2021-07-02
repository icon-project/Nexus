## Dependencies

[@substrate/api-sidecar](https://github.com/paritytech/substrate-api-sidecar)
REST service that makes it easy to interact with blockchain nodes built using Substrate's FRAME framework.

`npm install -g @substrate/api-sidecar`

Fee Aggregation SCORE v1.0.4

## Development

Start local Moonbeam development node.

`docker run -d --name moonbeam-dev -p 9944:9944 -p 9933:9933 purestake/moonbeam:tutorial-v7 --dev --ws-external --rpc-external`

## Production

`yarn sidecar`
`yarn start:pm2`
