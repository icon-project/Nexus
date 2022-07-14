const e2e = {
  state: {
    E2ETestMode: false,
    hanaWallet: {
      keys: {
        address: 'hx6d338536ac11a0a2db06fb21fe8903e617a6764d',
        privateKey: 'ad06b6bd754a4ccfe83c75884106efbe69e9f9ee30087225016a1219fa8dfd9a',
      },
      content: '',
    },
  },
  reducers: {
    setE2EState(state, payload = []) {
      const [property, value] = payload;
      return {
        ...state,
        [property]: value,
      };
    },
    setHanaWallet(state, payload = []) {
      const [property, value] = payload;
      return {
        ...state,
        hanaWallet: {
          ...state.hanaWallet,
          [property]: value,
        },
      };
    },
  },
  selectors: (slice) => ({
    selectE2ETestMode() {
      return slice((state) => state.E2ETestMode);
    },
    selectHanaWallet() {
      return slice((state) => state.hanaWallet);
    },
  }),
};

export default e2e;
