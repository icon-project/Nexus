import { IconAmount, IconUtil } from 'icon-sdk-js';
import { SUCCESS_TRANSACTION } from 'utils/constants';
import { httpProvider } from 'connectors/constants';

export default class Request {
  constructor(method, params) {
    this.jsonrpc = '2.0';
    this.id = IconUtil.getCurrentTime();
    this.method = method;
    this.params = params;
  }
}

export const convertToICX = (balance) => {
  return IconAmount.of(balance, IconAmount.Unit.LOOP).convertUnit(IconAmount.Unit.ICX).toString();
};

export const makeICXCall = async (payload) => {
  try {
    const result = await httpProvider.request(new Request('icx_call', payload)).execute();

    return result;
  } catch (err) {
    console.log('makeICXCall err', err);
    return 0;
  }
};

export const resetTransferStep = () => {
  const event = new Event(SUCCESS_TRANSACTION);
  document.dispatchEvent(event);
};
