import { IconAmount, IconUtil, HttpProvider } from 'icon-sdk-js';
import { currentICONexNetwork } from '../constants';
import { SUCCESS_TRANSACTION } from 'utils/constants';

export default class Request {
  constructor(id, method, params) {
    this.jsonrpc = '2.0';
    this.id = id;
    this.method = method;
    this.params = params;
  }
}

export const convertToICX = (balance) => {
  return IconAmount.of(balance, IconAmount.Unit.LOOP).convertUnit(IconAmount.Unit.ICX).toString();
};

export const httpProvider = new HttpProvider(currentICONexNetwork.endpoint);

export const makeICXCall = async (payload) => {
  try {
    const requestId = IconUtil.getCurrentTime();
    const request = new Request(requestId, 'icx_call', payload);

    const result = await httpProvider.request(request).execute();
    return result;
  } catch (err) {
    console.log('err', err);
    return 0;
  }
};

export const resetTransferStep = () => {
  const event = new Event(SUCCESS_TRANSACTION);
  document.dispatchEvent(event);
};
