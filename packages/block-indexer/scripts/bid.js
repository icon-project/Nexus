'use strict';

const fs = require('fs');
const IconService = require('icon-sdk-js');
const { IconAmount, IconConverter, HttpProvider, IconWallet, IconBuilder, SignedTransaction } = require('icon-sdk-js');

const httpProvider = new HttpProvider('http://localhost:9082/api/v3');
const iconService = new IconService(httpProvider);

// FAS 1.0.4
const fasAddress = 'cx51291cbe0fff966b881d251b9414e54f5a02dac7';
const tokenName = 'Sample2';

//       1000000000000000000 = 1 ICX
//           567000000000000
//          8086000000000000
//            20210000000000
// 1000000000000000000000000
//      15000000000000000000 =   15 ICX
//    1088990666912500000000 = 1088 ICX
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
- FAS deployed cxd426e4a2d8f9571466ceedc376fdad7d0a368ee0
- hx774ca45c762872ac6dd4780784e279ceb389dec9 has 600 ICX
- FAS ABCDE balance: 200
- Registered ABCDE
- availableBalance ABCDE: 200
- setDurationTime to 60s
- bid
*/

async function bid(walletFile, amount) {
  console.log(`${walletFile} bid ${amount} for ${tokenName}`);

  const keystore = JSON.parse(fs.readFileSync(walletFile));
  const wallet = IconWallet.loadKeystore(keystore, 'tien12345');
  const { CallTransactionBuilder } = IconBuilder;

  const txObj = new CallTransactionBuilder()
    .from(wallet.getAddress())
    .to(fasAddress) // FAS address
    .value(IconConverter.toHex(IconAmount.of(amount, IconAmount.Unit.ICX).toLoop())) // minimum bid 100 ICX
    .stepLimit(IconConverter.toBigNumber(1000000000))
    .nid(IconConverter.toBigNumber(3))
    .version(IconConverter.toBigNumber(3))
    .timestamp((new Date()).getTime() * 1000)
    .method('bid')
    .params({
      _tokenName: tokenName
    })
    .build();

  const signedTransaction = new SignedTransaction(txObj, wallet);
  const txHash = await iconService.sendTransaction(signedTransaction).execute();

  // ./goloop rpc txresult 0x21c5da8d60bc7b0f806552f7095daad5ac40f47106e96821825e861ae6ed7515 --uri http://localhost:9082/api/v3
  console.log(txHash);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testBid() {
  bid('./wallet1.json', 100.0025);
  await sleep(30 * 1000);
  bid('./wallet2.json', 115.873593);
  await sleep(30 * 1000);
  bid('./wallet3.json', 130.858);
  await sleep(30 * 1000);
  bid('./wallet1.json', 152.456789);
  await sleep(30 * 1000);
  bid('./wallet2.json', 170.000787);
}

async function endBid() {
  bid('./wallet3.json', 100.858);
}

async function getDefaultStepCost() {
  const { CallBuilder } = IconBuilder;
  const callBuilder = new CallBuilder();

  const call = callBuilder
    .to('cx0000000000000000000000000000000000000000')
    .method('getStepCosts')
    .build();

  const stepCosts = await iconService.call(call).execute();

  // For sending token, it is about twice the default value.
  return IconConverter.toBigNumber(stepCosts.default).times(2);
}

function testConverter() {
  // const defaultStep = await getDefaultStepCost();
  // console.log(defaultStep);
  // testBid();
  // bid('./wallet2.json', 100); // end current auction

  console.log(IconAmount.Unit.LOOP);
  console.log(IconAmount.of(10.25, IconAmount.Unit.ICX));
  console.log('convertUnit:', IconAmount.of(10.25, IconAmount.Unit.ICX).convertUnit(IconAmount.Unit.LOOP));
  console.log('toLoop:', IconAmount.of(10.25, IconAmount.Unit.ICX).toLoop());
  console.log('toLoop hex:', IconConverter.toHex(IconAmount.of(10.23456789, IconAmount.Unit.ICX).toLoop()));
  console.log('toLoop hex:', IconConverter.toHex(IconAmount.of(110.00033344455, IconAmount.Unit.ICX).toLoop()));
  console.log('toLoop hex:', IconConverter.toHex(IconAmount.of(125.00055, IconAmount.Unit.ICX).toLoop()));
  console.log('toBigNumber:', IconConverter.toBigNumber(10));
  console.log('toBigNumber hex:', IconConverter.toHex(IconConverter.toBigNumber(10)));
}

(async () => {
  // testBid();
  endBid();
})();

/*
./goloop rpc txresult 0x182c3c3d1b4e9b62400a2ab790570af5227ff64ce8c103a24adbdde5b50835a0 --uri http://localhost:9082/api/v3




./goloop rpc sendtx call --uri http://localhost:9082/api/v3 --method setDurationTime --to cx7dd016d0694830cbac5c1eeaec4313a9edc38d34 --param _duration=60000000 --key_store ./data/godWallet.json --key_password gochain --nid 3 --step_limit 10000000000

./goloop rpc call --uri http://localhost:9082/api/v3 --method tokens --to cxb49c78f34202c21b4e3798b091d9a830db3a573c

./goloop rpc sendtx call --uri http://localhost:9082/api/v3 --method transfer --to cxc19904be17ca12604c71823cc26906b9062e6151 --param _to=cxb49c78f34202c21b4e3798b091d9a830db3a573c --param _value=0x56BC75E2D63100000 --key_store ./data/godWallet.json --key_password gochain --step_limit 10000000000 --nid 3

./goloop rpc call --uri http://localhost:9082/api/v3 --method availableBalance --to cxb49c78f34202c21b4e3798b091d9a830db3a573c --param _tokenName=ABCDE

./goloop rpc call --uri http://localhost:9082/api/v3 --method getCurrentAuction --to cxb49c78f34202c21b4e3798b091d9a830db3a573c --param _tokenName=ABCDE

errors

failure: { code: '0x63', message: 'Reverted(67)' }: auction ended
*/
