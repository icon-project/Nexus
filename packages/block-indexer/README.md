## Dependencies

Fee Aggregation SCORE v1.0.4

## Initial database
STOP all block-indexer server before running this command
cmd: `node ./db-init/index.js`
Then go to `registered_tokens` table and check records again

## Development

Start local Moonbeam development node.

`docker run -d --name moonbeam-dev -p 9944:9944 -p 9933:9933 purestake/moonbeam:tutorial-v7 --dev --ws-external --rpc-external`

## Deployment

 Preparing environment requirements
 Deploy testnet
 Test transfers with CLI
 Create test accounts
 Configure apps and database (`.env` files, tables indexer_stats, networks)
 Update apps with new contracts
 Tests apps

### Tools

npm i eth-cli -g

https://geth.ethereum.org/downloads/

## Production

`yarn start:pm2`

Configure cron job to update relayer candidate rewards.

```bash
$ crontab -e

# add this script and save changes.
# ref: https://crontab.guru/
0 0 * * * /home/ubuntu/apps/btp-dashboard/packages/block-indexer/scripts/reward_reader.sh

$ crontab -l
```