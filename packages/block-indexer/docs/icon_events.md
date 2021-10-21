# ICON Events

## TransferStart

Ref: https://github.com/icon-project/btp/blob/icondao/javascore/nativecoin/src/main/java/foundation/icon/btp/nativecoin/NCSEvents.java#L35

```json
{
  "to": "cxa53fcf3271c389c4aef54387db747e352d6edc00", // token_bsh.icon, nativebsh.icon
  "cumulativeStepUsed": "0x2fbf7",
  "stepUsed": "0x2fbf7",
  "stepPrice": "0x0",
  "eventLogs": [
    {
      "scoreAddress": "cx98f0d272540ecd1b9adabbac30d92ed9238a49b7",
      "indexed": [
        "Message(str,int,bytes)",
        "btp://0x97.bsc/0xAaFc8EeaEE8d9C8bD3262CCE3D73E56DeE3FB776",
        "0x2"
      ],
      "data": [
        "0xf8fdb83e6274703a2f2f30786433356262622e69636f6e2f637839386630643237323534306563643162396164616262616333306439326564393233386134396237b8396274703a2f2f307839372e6273632f30784161466338456561454538643943386244333236324343453344373345353644654533464237373688546f6b656e42534801b876f87400b871f86faa687861326333393163373938653033316366373539626163373735313231373138383836643536376666aa307837306537383964326635643436396561333065303532356462666464353531356436656164333064d8d78345544889008963dd8c2c5e000088016345785d8a0000"
      ]
    },
    {
      "scoreAddress": "cxa53fcf3271c389c4aef54387db747e352d6edc00", // token_bsh.icon, nativebsh.icon
      "indexed": [
        "TransferStart(Address,str,int,bytes)",
        "hxa2c391c798e031cf759bac775121718886d567ff"
      ],
      "data": [
        "btp://0x97.bsc/0x70e789d2f5d469ea30e0525dbfdd5515d6ead30d",
        "0x1",
        "0xd8d78345544889008963dd8c2c5e000088016345785d8a0000"
      ]
    }
  ],
  "logsBloom": "0x000000000000000000001000000000...",
  "status": "0x1",
  "blockHash": "0xf584c6833c8a56752d7560a62fa60c10b3962a6eec2f129428ee0c7a3e4aea1a",
  "blockHeight": "0x20e",
  "txIndex": "0x0",
  "txHash": "0xf0b9b769e2194795f69ad441328a6f26b24527217027e31333e17ce6ec0c7b02"
}
```

## TransferEnd

Ref: https://github.com/icon-project/btp/blob/icondao/javascore/nativecoin/src/main/java/foundation/icon/btp/nativecoin/NCSEvents.java#L46

```json
{
  "to": "cx98f0d272540ecd1b9adabbac30d92ed9238a49b7", // bmc.icon
  "cumulativeStepUsed": "0x123983",
  "stepUsed": "0x123983",
  "stepPrice": "0x0",
  "eventLogs": [
    {
      "scoreAddress": "cxeb5da12e7231b218131ba33b8c84423fde1ef506", // nativebsh.icon
      "indexed": [
        "TransferEnd(Address,int,int,bytes)",
        "hxa2c391c798e031cf759bac775121718886d567ff"
      ],
      "data": [ // failed case: data: [ '0x5b', '0x1', '0x496e76616c696441646472657373' ]
        "0x1",
        "0x0",
        "0x"
      ]
    }
  ],
  "logsBloom": "0x0000000000000020000000000000000000000...",
  "status": "0x1",
  "blockHash": "0xcc17a4d76d56f5f1f189a0e5eeea242ce5c90b604022025e1f84925472999a61",
  "blockHeight": "0x240",
  "txIndex": "0x0",
  "txHash": "0xae12ab8d046bf739f1d25edd1bb55878a0a1a35670326143bad81383fe076826"
}
```
