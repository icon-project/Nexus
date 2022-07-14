const e2e = {
  state: {
    E2ETestMode: false,
  },
  reducers: {
    setE2EState(state, prop = []) {
      const [property, payload] = prop;
      return {
        ...state,
        [property]: payload,
      };
    },
  },
  selectors: (slice) => ({
    selectE2ETestMode() {
      return slice((state) => state.E2ETestMode);
    },
  }),
};

export default e2e;
