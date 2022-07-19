const e2e = {
  state: {
    E2ETestMode: false,
  },
  reducers: {
    setE2EState(state, payload = []) {
      const [property, value] = payload;
      return {
        ...state,
        [property]: value,
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
