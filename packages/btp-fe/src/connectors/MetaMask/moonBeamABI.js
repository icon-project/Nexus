export const MB_ABI = [
  {
    name: 'getBalanceOf',
    inputs: [
      {
        internalType: 'address',
        name: '_owner',
        type: 'address',
      },
      {
        internalType: 'string',
        name: '_coinName',
        type: 'string',
      },
    ],
    outputs: [
      {
        internalType: 'uint256',
        name: '_usableBalance',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_lockedBalance',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_refundableBalance',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_to',
        type: 'string',
      },
    ],
    name: 'transferNativeCoin',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
    payable: true,
  },
];
