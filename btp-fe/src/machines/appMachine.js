import { createMachine, assign, send } from "xstate";
// import { pure } from "xstate/lib/actions";

// Machine
const services = {};

const actionObj = {};

const guards = {};

export const appMachine = createMachine(
  {
    id: "btp-dashboard",
    initial: "landing",
    context: {
      loading: false,
      data: null,
    },
    states: {
      landing: {},
      home: {
        after: {
          5000: "landing",
        },
      },
      network: {
        after: {
          5000: "landing",
        },
      },
      transfer: {},
      governance: {},
      feeAuction: {},
    },
    on: {
      FETCH: {},
      NAVIGATE_HOME: ".home",
      NAVIGATE_NETWORK: ".network",
      NAVIGATE_LANDING: ".landing",
    },
  },
  { services, actions: actionObj, guards }
);
