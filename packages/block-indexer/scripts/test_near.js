const nearApi = require('near-api-js');

// configure network settings and key storage
const config = {
  networkId: 'testnet',
  nodeUrl: 'https://rpc.testnet.near.org'
};

// converts NEAR amount into yoctoNEAR (10^-24)
const amountInYocto = nearApi.utils.format.parseNearAmount('1');
console.log(amountInYocto);

const amountInNEAR = nearApi.utils.format.formatNearAmount('242900095612200000000');
console.log(amountInNEAR);

async function getTxStatus() {
  const provider = new nearApi.providers.JsonRpcProvider('https://rpc.testnet.near.org');
  const txHash = '6hHHS32khEdLe9msPgd3vE9KRHdNAAgRPe8zD8R8PiT7';
  const accountId = 'tiendq.testnet';

  const result = await provider.txStatus(txHash, accountId);
  console.log(result);
}

async function dumpBlock() {
  const provider = new nearApi.providers.JsonRpcProvider('https://rpc.testnet.near.org');
  // const blockData = await provider.block({ finality: 'final' });
  const blockData = await provider.block({ blockId: 73656064 });

  console.log(blockData);

  for (const chunk of blockData.chunks) {
    const chunkData = await provider.chunk(chunk.chunk_hash);
    console.log(chunkData);

    for (const tx of chunkData.transactions) {
      const txData = await provider.txStatus(tx.hash, tx.signer_id);

      // https://stackoverflow.com/questions/70209779/how-can-i-decode-function-call-argument
      console.log(txData);
      console.log(txData.transaction.actions);
    }
  }
}

(async function () {
  /*global.near = await nearApi.connect(config);

  // ---------------------------------------------------------------------------
  // here you have access to `near-api-js` and a valid connection object `near`
  // ---------------------------------------------------------------------------

  const result = await nearApi.connection.provider.block({
    blockId: '9rRDD9diZHdQKKsesDWwo6rBJ1tejDTKFC5Xs2eDDomG'
  });

  console.log(result);*/
  // await getTxStatus();
  await dumpBlock();
})(global);
