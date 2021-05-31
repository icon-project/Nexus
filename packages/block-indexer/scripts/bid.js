'use strict';

const fs = require('fs');
const IconService = require('icon-sdk-js');
const { IconAmount, IconConverter, HttpProvider, IconWallet, IconBuilder, SignedTransaction } = require('icon-sdk-js');

const httpProvider = new HttpProvider('http://localhost:9082/api/v3');
const iconService = new IconService(httpProvider);

//     000000000000000000
//   15000000000000000000 =   15 ICX
// 1088990666912500000000 = 1088 ICX
// ./goloop rpc balance hx774ca45c762872ac6dd4780784e279ceb389dec9 --uri http://localhost:9082/api/v3
// ./goloop rpc balance hxfafd853a7b47be47aa19acfb60e730e476fad2ab --uri http://localhost:9082/api/v3
async function transfer() {
  const keystore = JSON.parse(fs.readFileSync('./wallet1.json'));
  const wallet = IconWallet.loadKeystore(keystore, 'tien12345');
  const { IcxTransactionBuilder } = IconBuilder;

  const txObj = new IcxTransactionBuilder()
    .from(wallet.getAddress())
    .to('hxfafd853a7b47be47aa19acfb60e730e476fad2ab') // wallet2
    .value(IconConverter.toHex(IconAmount.of(10, IconAmount.Unit.ICX).toLoop()))
    .stepLimit(IconConverter.toBigNumber(10000000000))
    .nid(IconConverter.toBigNumber(3))
    .nonce(IconConverter.toBigNumber(1))
    .version(IconConverter.toBigNumber(3))
    .timestamp((new Date()).getTime() * 1000)
    .build()

  const signedTransaction = new SignedTransaction(txObj, wallet)
  const txHash = await iconService.sendTransaction(signedTransaction).execute();

  // ./goloop rpc txresult 0xaf5c0716a2f49ad3809fd63cdbe86c930d2e6e3535bf738206411dc54b4cdd88 --uri http://localhost:9082/api/v3
  console.log(txHash);
}

//./goloop rpc sendtx call --uri http://localhost:9082/api/v3 --method transfer --to cxc19904be17ca12604c71823cc26906b9062e6151 --param _to="cxb49c78f34202c21b4e3798b091d9a830db3a573c" --param _value=100000000000000000000  --key_store ./data/godWallet.json --key_password gochain --nid 3 --step_limit 10000000000 --content_type application/java
//./goloop rpc call --uri http://localhost:9082/api/v3 --method balanceOf --to cxc19904be17ca12604c71823cc26906b9062e6151 --param _to=cxb49c78f34202c21b4e3798b091d9a830db3a573c

//./goloop rpc sendtx call --uri http://localhost:9082/api/v3 --method registerIRC2 --to cxb49c78f34202c21b4e3798b091d9a830db3a573c --param _tokenName="ABCDE" --param _tokenAddress=cxc19904be17ca12604c71823cc26906b9062e6151  --key_store ./data/godWallet.json --key_password gochain --nid 3 --step_limit 10000000000
/*
- Token deployed cx18fbe903abdbb4b1e484e3135782ba2b8ba8dd4c
- CPS deployed cx031b8ac09dac6acc9719442ed80bd514fa914db2
- FAS deployed cx8ca6ca89fdf3ce6e77b9531b66da51a455be7367
- hx774ca45c762872ac6dd4780784e279ceb389dec9 has 600 ICX
- FAS ABCDE balance: 200
- Registered ABCDE
- availableBalance ABCDE: 200
- setDurationTime to 60s
- bid
*/

async function bid() {
  const keystore = JSON.parse(fs.readFileSync('./wallet1.json'));
  const wallet = IconWallet.loadKeystore(keystore, 'tien12345');
  const { CallTransactionBuilder } = IconBuilder;

  const txObj = new CallTransactionBuilder()
    .from(wallet.getAddress())
    .to('cx8ca6ca89fdf3ce6e77b9531b66da51a455be7367') // FAS address
    .value(IconConverter.toHex(IconAmount.of(100, IconAmount.Unit.ICX).toLoop())) // minimum bid 100 ICX
    // .value(IconConverter.toHex(IconAmount.of(115, IconAmount.Unit.ICX).toLoop())) // next bid at least 10% higher
    .stepLimit(IconConverter.toBigNumber(10000000000))
    .nid(IconConverter.toBigNumber(3))
    .version(IconConverter.toBigNumber(3))
    .timestamp((new Date()).getTime() * 1000)
    .method('bid')
    .params({
      _tokenName: 'SampleToken020'
    })
    .build();

  const signedTransaction = new SignedTransaction(txObj, wallet)
  const txHash = await iconService.sendTransaction(signedTransaction).execute();

  // ./goloop rpc txresult 0x0da152b1fcd274096eab4b69c8f6b86134a15f95e432f818292b5fb8f4b70f41 --uri http://localhost:9082/api/v3
  // ./goloop rpc txresult 0x0e61a59542bd4ac8b8bbf099a7ad102be2f3855c6623363bef2e940592bc97c0 --uri http://localhost:9082/api/v3
  console.log(txHash);
}

// transfer();
bid();


/*
./goloop rpc sendtx call --uri http://localhost:9082/api/v3 --method setDurationTime --to cx7dd016d0694830cbac5c1eeaec4313a9edc38d34 --param _duration=60000000 --key_store ./data/godWallet.json --key_password gochain --nid 3 --step_limit 10000000000

./goloop rpc call --uri http://localhost:9082/api/v3 --method tokens --to cxb49c78f34202c21b4e3798b091d9a830db3a573c

./goloop rpc sendtx call --uri http://localhost:9082/api/v3 --method transfer --to cxc19904be17ca12604c71823cc26906b9062e6151 --param _to=cxb49c78f34202c21b4e3798b091d9a830db3a573c --param _value=0x56BC75E2D63100000 --key_store ./data/godWallet.json --key_password gochain --step_limit 10000000000 --nid 3

./goloop rpc call --uri http://localhost:9082/api/v3 --method availableBalance --to cxb49c78f34202c21b4e3798b091d9a830db3a573c --param _tokenName=ABCDE

./goloop rpc call --uri http://localhost:9082/api/v3 --method getCurrentAuction --to cxb49c78f34202c21b4e3798b091d9a830db3a573c --param _tokenName=ABCDE
*/
