import { push } from 'connected-react-router';
const app = {
  state: {
    isFirstLoad: false,
  },
  reducers: {
    setFirstLoad(state, payload) {
      return {
        ...state,
        isFirstLoad: payload,
      };
    },
  },
  effects: (dispatch) => ({
    async navigateExample() {
      dispatch(push('/login'));
    },
    async getLocation(payload, rootState) {
      return rootState.router.location;
    },
  }),
};

export default app;
