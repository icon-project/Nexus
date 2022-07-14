import { useEffect } from 'react';

const HanaWalletSimulation = () => {
  const address = 'hx6d338536ac11a0a2db06fb21fe8903e617a6764d';
  //   const privateKey = 'abc';

  useEffect(() => {
    const handler = (event) => {
      const { type, payload } = event.detail;
      console.log(
        '🚀 ~ file: HanaWalletSimulation.jsx ~ line 6 ~ window.addEventListener ~ event',
        event,
      );

      let responseEvt = null;

      switch (type) {
        case 'REQUEST_HAS_ADDRESS':
          responseEvt = new CustomEvent('ICONEX_RELAY_RESPONSE', {
            detail: {
              type: 'RESPONSE_HAS_ADDRESS',
              payload: {
                hasAddress: payload === address,
              },
            },
          });
          break;

        case 'REQUEST_HAS_ACCOUNT':
          responseEvt = new CustomEvent('ICONEX_RELAY_RESPONSE', {
            detail: {
              type: 'RESPONSE_HAS_ACCOUNT',
            },
          });
          break;
        default:
          break;
      }

      if (responseEvt) {
        window.dispatchEvent(responseEvt);
      }
    };

    window.addEventListener('ICONEX_RELAY_REQUEST', handler);

    // return () => {
    //   window.removeEventListener('ICONEX_RELAY_REQUEST', handler, true);
    // };
  }, []);

  return 'abc';
};

export default HanaWalletSimulation;
