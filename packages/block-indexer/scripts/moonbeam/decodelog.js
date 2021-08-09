const Web3 = require('web3');
const abiBSHCore = require('./bsh_core_abi.json');
const abiBSHPeriphery = require('./BSHPeriphery.abi.json');

/*
   -- Define Provider & Variables --
*/
// Provider
const web3 = new Web3('http://54.251.114.18:9933'); //Change to correct network

// Ethan
const account_from = {
   privateKey: '0x7dce9bc8babb68fec1409be38c8e1a52650206a7ed90ff956ae8a6d15eeaaef4',
   address: '0xFf64d3F6efE2317EE2807d223a0Bdc4c0c49dfDB',
};

// Bob
const addressTo = '0x4B0d307675CDae97Fc624E1987B942f4B9483231'; // Change addressTo

/*
   -- Create and Deploy Transaction --
*/
const deploy = async () => {
   console.log(
      `Attempting to send transaction from ${account_from.address} to ${addressTo}`
   );

   const input = {
        gas: 21000,
        to: addressTo,
        value: web3.utils.toWei('1', 'ether'),
    };

  console.log(input);

   // Sign Tx with PK
   const createTransaction = await web3.eth.accounts.signTransaction(
      input,
      account_from.privateKey
   );

   // Send Tx and Wait for Receipt
   const createReceipt = await web3.eth.sendSignedTransaction(
      createTransaction.rawTransaction
   );

   console.log(
      `Transaction successful with hash: ${createReceipt.transactionHash}`
   );

   // eth address:balance --network http://localhost:9933 0x4B0d307675CDae97Fc624E1987B942f4B9483231
};

// 1 DEV from Bob to Alice
// http://54.251.114.18/#/explorer/query/0xa5cfb4c259b70db591e8130df30cd3e2eb2af40c0e94d75152ab2b2d70d46f62
const decodeLog = (inputs) => {
  const hexString = '0x0000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000396274703a2f2f3078332e69636f6e2f6378323663646232643963663333646565303738303536353332313735613639366238613966636337310000000000000000000000000000000000000000000000000000000000000000000000000000f3f8f1b83a6274703a2f2f30783530312e7072612f307835434333303732363861313339334142394137363441323044414345383438414238323735633436b8396274703a2f2f3078332e69636f6e2f6378323663646232643963663333646565303738303536353332313735613639366238613966636337318a6e6174697665636f696e01b86cf86a00b867f865aa307834423064333037363735434461653937466336323445313938374239343266344239343833323331aa687863663361663661303563386631643661386562396635336665353535663466646634333136323632cecd83444556880dbd2fc137a3000000000000000000000000000000';
  const topics = []; // ['0x37be353f216cf7e33639101fd610c542e6a0c0109173fa1c1d8b04d34edb7c1b'];
  const result = web3.eth.abi.decodeLog(inputs, hexString, topics);
  console.log(result);
};

const decodeLog2 = (inputs) => {
  const hexString = '0x0000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000396274703a2f2f3078332e69636f6e2f687863663361663661303563386631643661386562396635336665353535663466646634333136323632000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000dbd2fc137a30000000000000000000000000000000000000000000000000000002386f26fc1000000000000000000000000000000000000000000000000000000000000000000034445560000000000000000000000000000000000000000000000000000000000';
  const topics = ['0x0000000000000000000000004b0d307675cdae97fc624e1987b942f4b9483231'];
  const result = web3.eth.abi.decodeLog(inputs, hexString, topics);
  console.log(result);
};

// deploy();

// decodeLog();

function startDecode() {
  const events = abiBSHPeriphery.filter(item => 'event' === item.type);

  for (const event of events) {
    console.log(event.name);

    try {
      decodeLog2(event.inputs);
    }
    catch (error) {
      console.log(error);
    }
  }
}

// startDecode();

/* output
TransferEnd
Result {
  '0': '0x4B0d307675CDae97Fc624E1987B942f4B9483231',
  '1': '96',
  '2': '1',
  '3': '\x00',
  __length__: 4,
  _from: '0x4B0d307675CDae97Fc624E1987B942f4B9483231',
  _sn: '96',
  _code: '1',
  _response: '\x00'
}
TransferStart
Result {
  '0': '0x4B0d307675CDae97Fc624E1987B942f4B9483231',
  '1': 'btp://0x3.icon/hxcf3af6a05c8f1d6a8eb9f53fe555f4fdf4316262',
  '2': '1',
  '3': [
    [
      'DEV',
      '990000000000000000',
      '10000000000000000',
      coinName: 'DEV',
      value: '990000000000000000',
      fee: '10000000000000000'
    ]
  ],
  __length__: 4,
  _from: '0x4B0d307675CDae97Fc624E1987B942f4B9483231',
  _to: 'btp://0x3.icon/hxcf3af6a05c8f1d6a8eb9f53fe555f4fdf4316262',
  _sn: '1',
  _assetDetails: [
    [
      'DEV',
      '990000000000000000',
      '10000000000000000',
      coinName: 'DEV',
      value: '990000000000000000',
      fee: '10000000000000000'
    ]
  ]
}
UnknownResponse
Result {
  '0': 'btp://0x3.icon/hxcf3af6a05c8f1d6a8eb9f53fe555f4fdf4316262',
  '1': '1',
  __length__: 2,
  _from: 'btp://0x3.icon/hxcf3af6a05c8f1d6a8eb9f53fe555f4fdf4316262',
  _sn: '1'
}

*/

function hashEventName() {
  const TransferStart = {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "_from",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "_to",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_sn",
        "type": "uint256"
      },
      {
        "components": [
          {
            "internalType": "string",
            "name": "coinName",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "fee",
            "type": "uint256"
          }
        ],
        "indexed": false,
        "internalType": "struct Types.AssetTransferDetail[]",
        "name": "_assetDetails",
        "type": "tuple[]"
      }
    ],
    "name": "TransferStart",
    "type": "event"
  };

  const TransferEnd = {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "_from",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_sn",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_code",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "_response",
        "type": "string"
      }
    ],
    "name": "TransferEnd",
    "type": "event"
  };

  console.log(web3.eth.abi.encodeEventSignature(TransferStart));
}

hashEventName();
