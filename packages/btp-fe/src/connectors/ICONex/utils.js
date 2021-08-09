import { IconAmount } from 'icon-sdk-js';
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
