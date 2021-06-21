const modal = {
  name: 'modal',
  state: {
    display: false,
    options: {},
  },
  reducers: {
    setDisplay(state, display) {
      return {
        ...state,
        display,
      };
    },
    openModal(state, payload = {}) {
      return {
        ...state,
        options: {
          ...payload,
        },
        display: true,
      };
    },
  },
  effects: () => ({
    handleError(error) {
      this.openModal({
        icon: 'xIcon',
        desc: (error && error.message) || error || 'Something went wrong!',
      });
    },
  }),

  selectors: (slice) => ({
    selectDisplay() {
      return slice((state) => state.display);
    },
    selectOptions() {
      return slice((state) => state.options);
    },
  }),
};

export default modal;
