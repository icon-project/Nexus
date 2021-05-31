import IconService, { HttpProvider, IconAmount } from 'icon-sdk-js';
import { currentICONexNetwork } from '../constants';

const iconService = new IconService(new HttpProvider(currentICONexNetwork.endpoint));

export const getBalance = (address) => {
  // https://github.com/icon-project/icon-sdk-js/issues/26#issuecomment-843988076
  return iconService
    .getBalance(address)
    .execute()
    .then((balance) => {
      return IconAmount.of(balance, IconAmount.Unit.LOOP)
        .convertUnit(IconAmount.Unit.ICX)
        .toString();
    });
};

export const sendTransaction = async (transaction) => {
  return await iconService.sendTransaction(transaction).execute();
};
