## Dependencies

Fee Aggregation SCORE v1.0.4

## Initial database
STOP all block-indexer server before running this command
cmd: `node ./db-init/index.js`
Then go to `registered_tokens` table and check records again

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

## Add a new EVM chain to block-indexer package
### Assumptions
A new chain:
- uses Metamask wallet
- has the same/closest ABI set with ICON-MOONBEAM BTP.
- has the same/closest ABI set with ICON-BSC BTP, ref: https://github.com/icon-project/icon-bridge/discussions/68
### Configuations
Add these `required` configurations folowing the name pattern below to `.env` file
#### For ICON side
```javascript
ICON_<Network_Name>_BMC_ADDRESS=<bcm_address>
ICON_NATIVE_COIN_<Network_Name>_BSH_ADDRESS=<bts_address>
```

`<Network_Name>`: the network name
**Example:**
```bash
ICON_BSC_BMC_ADDRESS=cx23a91ee3dd290486a9113a6a42429825d813de53
ICON_NATIVE_COIN_BSC_BSH_ADDRESS=cxcef70e92b89f2d8191a0582de966280358713c32
```

#### For another network side (EVM)
```js
# Config for BSC
<Network_Name>_API_URL=<rpc_url>
<Network_Name>_BLOCK_HEIGHT=<block_height_you_want_to_start_from>
<Network_Name>_NETWORK_ID=<network_id>
# periphery
<Network_Name>_BMC_ADDRESS=<bmc_address>
# periphery
<Network_Name>_BSC_BMC_MANAGEMENT_ADDRESS=<bmc_management_address>
<Network_Name>_BSH_CORE_ADDRESS=bts.iconbridge.testnet
```

**Example:**
```js
BSC_API_URL=https://bsc-dataseed.binance.org/
BSC_BLOCK_HEIGHT=20738975
BSC_NETWORK_ID=0x38
# periphery
BSC_BMC_ADDRESS=0x034AaDE86BF402F023Aa17E5725fABC4ab9E9798
# management
BSC_BMC_MANAGEMENT_ADDRESS=0xe221e50fbe2Ba54b1898b4c02F66bf9598fbD1dB
BSC_BSH_CORE_ADDRESS=0x7A4341Af4995884546Bcf7e09eB98beD3eD26D28
```

#### Add more tokens
Add coin and tokens for the new network
```js
# === Register tokens (MAXIMUM index of token is 99) === #
# You can add or remove any REGISTERED_TOKENS_{number} if you want as long as maximum of index is 99
# After declaring REGISTERED_TOKENS_{#Number}, run this command to generate them in database `node ./db-init/index.js`
# tx_hash | contract_address | network_id | token_name | token_id
# ICON network

# register token for ICON
REGISTERED_TOKENS_0 = <TRANSACTION_HASH> | <ICON_NATIVE_COIN_BSC_BSH_ADDRESS> | ${ICON_NETWORK_ID} | ICX | ICX
REGISTERED_TOKENS_1 = <TRANSACTION_HASH> | <BNB_TOKEN_CONTRACT_ADDRESS_ON_ICON> | ${ICON_NETWORK_ID} | BNB | BNB
# register token for BSC
REGISTERED_TOKENS_2 = <TRANSACTION_HASH> | <BSC_BSH_CORE_ADDRESS> | ${BSC_NETWORK_ID} | BNB | BNB
REGISTERED_TOKENS_3 = <TRANSACTION_HASH> | <BNB_TOKEN_CONTRACT_ADDRESS_ON_BSC> | ${BSC_NETWORK_ID} | ICX | ICX
```

**Example:**
```bash
REGISTERED_TOKENS_0 = 0x98b315b5d389e61ebb5a6905e81129c75f992956010b0b8af152aaa742a80c40 | cxcef70e92b89f2d8191a0582de966280358713c32 | ${ICON_NETWORK_ID} | ICX | ICX

REGISTERED_TOKENS_1 = 0x98b315b5d389e61ebb5a6905e81129c75f992956010b0b8af152aaa742a80c29 | cx077807f2322aeb42ea19a1fcc0c9f3d3f35e1461 | ${ICON_NETWORK_ID} | BNB | BNB

REGISTERED_TOKENS_2 = 0x98b315b5d389e61ebb5a6905e81129c75f992956010b0b8af152aaa742a80c32 | 0x7A4341Af4995884546Bcf7e09eB98beD3eD26D28 | ${BSC_NETWORK_ID} | BNB | BNB

REGISTERED_TOKENS_3 = 0x98b315b5d389e61ebb5a6905e81129c75f992956010b0b8af152aaa742a80c35 | 0x9b7b6A964f8870699Ae74744941663D257b0ec1f | ${BSC_NETWORK_ID} | ICX | ICX
```

***Note:** this configuration works when you perform the command `node ./db-init/index.js`. You should do it manually if you want to insert a new token into DB*

#### Add helthcheck config
```js
# The structure is <NETWORK_ID|<NETWORK_NAME>|<INTERVAL_TIME_TO_CHECK_BLOCK_INDEXER_IS_WORKING_BY_MINUTES>

HEALTH_CHECK_PERIOD=${ICON_NETWORK_ID}|ICON|5 || ${BSC_NETWORK_ID}|BSC|5 || ${HARMONY_NETWORK_ID}|HARMONY|10 || ${NEAR_NETWORK_ID}|NEAR|5
```
### Update source code

#### Update source code for ICON side
You must add a new record to `packages/block-indexer/src/modules/common/addresses.js` file

```js
function setBMCAddressMap() {
  // new config for BSC
  BMC_ADDRESS_MAP.set(process.env.ICON_BSC_BMC_ADDRESS, 'BSC');
  BMC_ADDRESS_MAP.set(process.env.ICON_WPS_BMC, 'WPS');
  // new config for Harmony
  BMC_ADDRESS_MAP.set(process.env.ICON_HMNY_BMC_ADDRESS, 'HARMONY');
}
function setBSHAddressMap() {
   // new config for BSC
  BSH_ADDRESS_MAP.set(process.env.ICON_NATIVE_COIN_BSC_BSH_ADDRESS, 'BSC');
  // new config for Harmony
  BSH_ADDRESS_MAP.set(process.env.ICON_NATIVE_COIN_HMNY_BSH_ADDRESS, 'HARMONY');
}
```
#### Register block-indexer for new network (EVM)
```js
case 'BSC': {
      const web3 = new Web3(process.env.BSC_API_URL);
      // With the new network using EVM, they always share the same ABI file, so we also use about event & action config for them
      const eventMap = getBscEventMap(web3);
      const actionMap = getBscActionMap(web3);

      const indexer = new Web3BlockIndexer({
        networkName: name,
        blockHeight: Number(process.env.BSC_BLOCK_HEIGHT),
        networkId: process.env.BSC_NETWORK_ID,
        endpointUrl: process.env.BSC_API_URL,
        bshAddress: process.env.BSC_BSH_CORE_ADDRESS,
        bmcAddress: process.env.BSC_BMC_ADDRESS,
        bmcManagementAddress: process.env.BSC_BMC_MANAGEMENT_ADDRESS,
        bshAbi: bscBshAbi
      }, eventMap, actionMap, web3);
      indexer.start();
      break;
    }
```
#### Add new pm2 file to starting block-indexer

Create a new json file with name `pm2.<network_name>.json`
`Example: pm2 file for BSC network`
```json
{
  "apps": [
    {
      "name": "bsc-indexer",
      "script": "./index.js",
      "args": "bsc",
      "cwd": "./",
      "log_date_format": "YYYY-MM-DD HH:mm Z",
      "env": {
        "NODE_ENV": "production",
        "LOGGER_NAME": "bsc"
      }
    }
  ]
}

```

#### Add script to start block-indexer on package.json

```json
# starting local for block indexer of BSC
"start:bsc": "LOGGER_NAME=bsc nodemon index.js bsc",
# starting prod for block indexer of BSC via pm2
"pm2:bsc": "pm2 start pm2.bsc.json",
```

## Add a new EVM chain to dashboard-api package
```js
BSC_NETWORK_ID=0x61
BSC_NAME=BNB Smart Chain
BSC_NATIVE_TOKEN=BNB
BSC_NETWORK_PATH_LOGO=./image/logo/binance-bnb-logo.png
BSC_NETWORK_URL=https://www.binance.com
BSC_API_URL=https://data-seed-prebsc-1-s1.binance.org:8545/
```