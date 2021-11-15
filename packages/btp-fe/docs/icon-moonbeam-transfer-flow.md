**Disclaimer:** The author is not a guy with the Blockchain knowledge background, and this chart aims to the overall look for FE/none BC knowledge/new approaching guys. Feel free to correct to make it better.

## Flowchart

- Update the chart [here](https://drive.google.com/file/d/1LTmAnJkdneSDyioVPlyG3QaBdT2VHb1c/view?usp=sharing)

## Details

### 1. Connect to wallet

**How to connect?**
- ICONex: https://www.icondev.io/iconex-connect/chrome-extension
- MetaMask: https://docs.metamask.io/guide/getting-started.html#connecting-to-metamask
  - [Get started with Ethereum](https://ethgasstation.info/calculatorTxV.php): `LINKS` section on sidebar

**Switch wallets to our testnet**

- ICONex: `Don't require` but more information to playground [here](https://www.icondev.io/references/how-to/change-network-in-iconex)
- MetaMask: [Moonbeam testnet guideline](https://docs.moonbeam.network/getting-started/local-node/using-metamask/)

### 2. Checking isApprovedForAll

> Before requesting transfer none native tokens, the first time, Requestor must call setApprovalForAll to authorize BSHCore >contract to transfer Tokens on Requestor's behave. Requestor is not required to repeat this step for following requests. `setApprovalForAll` takes effect until it's set back to false.

- ref: https://github.com/icon-project/btp-dashboard/issues/240

**Important note**: On the ICON network, there is a separate server called `irc31token contract` to handle none native coins. But, there is no such separation on Moonbeam BSH. So, any actions related to none native tokens on ICON (e.g. isApprovedForAll, setApprovalForAll, ...) will need to send a request `to` the `irc31 contract address` for proper data.

### 3. Claim refund flow

- ref: https://github.com/icon-project/btp-dashboard/issues/250

## Method refs:

- **transfer** (used for transfer none native coin): https://github.com/icon-project/btp/blob/c93cbc5cb01560387f6311d415b2deafe783392f/javascore/nativecoin/src/main/java/foundation/icon/btp/nativecoin/NativeCoinService.java#L181
- **transferNativeCoin**: https://github.com/icon-project/btp/blob/c93cbc5cb01560387f6311d415b2deafe783392f/javascore/nativecoin/src/main/java/foundation/icon/btp/nativecoin/NativeCoinService.java#L174
- **balanceOf** (locked and refundable balance): https://github.com/icon-project/btp/blob/c93cbc5cb01560387f6311d415b2deafe783392f/javascore/nativecoin/src/main/java/foundation/icon/btp/nativecoin/NativeCoinService.java#L134
- **balanceOf** (main balance): https://github.com/icon-project/btp/blob/c93cbc5cb01560387f6311d415b2deafe783392f/javascore/nativecoin/src/main/java/foundation/icon/btp/nativecoin/irc31/IRC31SupplierScoreInterface.java#L36
- **isApprovedForAll**: https://github.com/icon-project/btp/blob/c93cbc5cb01560387f6311d415b2deafe783392f/javascore/nativecoin/src/main/java/foundation/icon/btp/nativecoin/irc31/IRC31SupplierScoreInterface.java#L62
- **setApprovalForAll**: https://github.com/icon-project/btp/blob/c93cbc5cb01560387f6311d415b2deafe783392f/javascore/nativecoin/src/main/java/foundation/icon/btp/nativecoin/irc31/IRC31SupplierScoreInterface.java#L58
- **reclaim**: https://github.com/icon-project/btp/blob/c93cbc5cb01560387f6311d415b2deafe783392f/javascore/nativecoin/src/main/java/foundation/icon/btp/nativecoin/NativeCoinService.java#L156

## Example scripts:

**Transfer tokens**
- ICON => MB: https://github.com/icon-project/btp/blob/goloop2moonbeam/testnet/goloop2moonbeam/scripts/transfer_icx.sh
- MB => ICON: https://github.com/icon-project/btp/blob/goloop2moonbeam/testnet/goloop2moonbeam/scripts/transfer_dev.sh

