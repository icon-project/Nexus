import { ABI } from 'connectors/MetaMask/ABITest';

export const custom = {
  NEAR: {
    ABI,
    methods: {
      transferNativeCoin: {
        newName: 'abcTest',
        params: ({ to, value }) => [to, value],
      },
    },
  },
};
