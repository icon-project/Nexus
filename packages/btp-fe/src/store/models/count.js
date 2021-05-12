const count = {
  name: 'count',
  state: 0, // initial state
  reducers: {
    // handle state changes with pure functions
    increment(state, payload) {
      return state + payload;
    },
    decrement(state, payload) {
      return state - payload;
    },
  },
  effects: (dispatch) => ({
    // handle state changes with impure functions.
    // use async/await for async actions
    async incrementAsync(payload) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      dispatch.count.increment(payload);
    },
    async decrementAsync(payload) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      dispatch.count.decrement(payload);
    },
  }),
  selectors: (slice) => ({
    selectCount() {
      return slice((state) => state);
    },
  }),
};

export default count;
