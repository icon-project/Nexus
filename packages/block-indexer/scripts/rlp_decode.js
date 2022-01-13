const { decode } = require('rlp');

const data = [
  '0xe1a008f7ce30203eb1ff1d26492c94d9ab04d63f4e54f1f9e677e8d4a0d6daaab2dd',
  '0xc9880dbd2fc137a23cb0',
  '0xd8d78345544889008963dd8c2c5e000088016345785d8a0000'
];

for (const d of data) {
  const buf = decode(d);
  console.log(`${d} => ${buf[0].toString('hex')}`);
}
