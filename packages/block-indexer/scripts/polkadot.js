const { HttpProvider } = require('@polkadot/rpc-provider');

const provider = new HttpProvider('http://127.0.0.1:9933');

(async () => {
  //const version = await provider.send('system_chain', ['0x1ba30d059121f6c8b6f0e0a6e382e30707bcfeddf28ed69145aa0e62e063e855']);
  // const version = await provider.send('rpc_methods', []);
  // const version = await provider.send('chain_getHead', []);

  const block = await provider.send('chain_getBlock', ['0x5c0ab3ea5554cb142d64400e584a5f0434ce29b0d3f977972c56b1edd98ae2a6']);
  console.log(block);

  const metadata = await provider.send('state_getMetadata', ['0x5c0ab3ea5554cb142d64400e584a5f0434ce29b0d3f977972c56b1edd98ae2a6']);
  console.log(metadata);
})();

/*
0x5c0ab3ea5554cb142d64400e584a5f0434ce29b0d3f977972c56b1edd98ae2a6

{
  block: {
    header: {
      parentHash: 0xac1f84d5d32377726cdcff36ec02eb90cf2787358ce764ed87ac3e5381673ca3,
      number: 3,645,
      stateRoot: 0x1e5defce8b4af0af0fc6ec77719a1d4ae3fd0827705c977291dab73b03fd8512,
      extrinsicsRoot: 0xc01f974e54efc56dc160170cb85b0a96a22e8cbb416e013a5653b26e4888b449,
      digest: {
        logs: [
          {
            PreRuntime: [
              aura,
              0xfa711d1000000000
            ]
          },
          {
            Consensus: [
              fron,
              0x011755f12fee588d92aa7c0aae6bc94fdbe3bf044beca070f37edca8f836fcae6300
            ]
          },
          {
            Seal: [
              aura,
              0xb7566845241e9d2fd4b9f32c302b60c2d0e28619ab3d8c5f6f95590ea6fab5ef226212f5e90b8e8df7c9e0aa919b4dabe13b4dc64e9b86b2ffebf9662bf0fc0a
            ]
          }
        ]
      }
    },
    extrinsics: [
      {
        isSigned: false,
        method: {
          args: [
            1,622,191,068,002
          ],
          method: set,
          section: timestamp
        }
      },
      {
        isSigned: true,
        method: {
          args: [
            {
              Id: kjhbn6zW5vFQ2cF2HrdrLHbMHBhrTrGGuAbc6yAXNY2HgAv
            },
            5.0000 tEDG
          ],
          method: transfer,
          section: balances
        },
        era: {
          MortalEra: {
            period: 64,
            phase: 57
          }
        },
        nonce: 1,
        signature: 0x781c47b4528f9410b1f649d370e45d898fa96c964f693772bbc6ec6e4b391827c192b1b5cb5f8815ca9032d00302a36770c6686c9b998b0ef7c4612fa7c2688d,
        signer: {
          Id: nJrsrH8dov9Z36kTDpabgCZT8CbK1FbmjJvfU6qbMTG4g4c
        },
        tip: 0
      }
    ]
  },
  justifications: null
}*/
