const IconService = window['icon-sdk-js'];
const {
  IconBuilder: { CallTransactionBuilder },
  IconUtil: { serialize },
  IconConverter,
  HttpProvider,
  IconUtil,
} = IconService;

const BTPNetwork = {
  endpoint: 'http://54.251.114.18:9080/api/v3',
  BSHAddress: 'cx489ed02580ce5cab57925317373310205417c2b7',
};
const httpProvider = new HttpProvider(BTPNetwork.endpoint);
const FROM_ADDRESS = 'from-address';
let myTx = {};

class Request {
  constructor(id, method, params) {
    this.jsonrpc = '2.0';
    this.id = id;
    this.method = method;
    this.params = params;
  }
}

/* eslint-disable-next-line */
function onSubmit() {
  const txBuilder = new CallTransactionBuilder();
  const feeRate = document.getElementById('fee-input').value;
  const from = localStorage.getItem(FROM_ADDRESS);

  if (!feeRate || feeRate < 0) {
    alert('Please input fee');
    return;
  }

  if (!from) {
    alert('Please connect to your ICONex wallet as contract owner first');
    return;
  }

  const tx = txBuilder
    .from(from)
    .to(BTPNetwork.BSHAddress)
    .method('setFeeRatio')
    .params({ _feeNumerator: feeRate * 100 + '' })
    .nid(IconConverter.toBigNumber(3))
    .stepLimit(IconConverter.toBigNumber(1000000000))
    .nonce(IconConverter.toBigNumber(1))
    .version(IconConverter.toBigNumber(3))
    .timestamp(new Date().getTime() * 1000)
    .build();

  const rawTx = IconConverter.toRawTransaction(tx);
  myTx = rawTx;
  const transactionHash = serialize(rawTx);

  const event = new CustomEvent('ICONEX_RELAY_REQUEST', {
    detail: {
      type: 'REQUEST_SIGNING',
      payload: { from, hash: transactionHash },
    },
  });
  window.dispatchEvent(event);
}

/* eslint-disable-next-line */
function onConnectWallet() {
  const event = new CustomEvent('ICONEX_RELAY_REQUEST', {
    detail: { type: 'REQUEST_ADDRESS' },
  });
  window.dispatchEvent(event);
}

/* eslint-disable no-case-declarations */
async function eventHandler(event) {
  const { type, payload } = event.detail;

  try {
    switch (type) {
      case 'RESPONSE_SIGNING':
        myTx.signature = payload;
        const requestId = IconUtil.getCurrentTime();

        const request = new Request(requestId, 'icx_sendTransaction', {
          ...myTx,
          signature: payload,
        });

        await httpProvider.request(request).execute();
        alert('Your transaction was submitted successfully');
        break;

      case 'RESPONSE_ADDRESS':
        setDisableSubmitBtn(false);
        localStorage.setItem(FROM_ADDRESS, payload);
        showConnectICONexBtn(false, payload);
        break;
      default:
        break;
    }
  } catch (err) {
    alert('ERR: ', err);
  }
}

/**
 * Run onload
 */

// add listener from ICONex wallet
window.addEventListener('ICONEX_RELAY_RESPONSE', eventHandler);
window.onload = setInitialDOMState;

/**
 * DOM manipulation
 */

/* eslint-disable-next-line */
function setDisableSubmitBtn(state) {
  const submitBtn = document.getElementById('submit-btn');
  submitBtn.disabled = state;
}

function setInitialDOMState() {
  const fromAddress = localStorage.getItem(FROM_ADDRESS);
  setDisableSubmitBtn(!fromAddress);
  showConnectICONexBtn(!fromAddress, fromAddress);
}

/* eslint-disable-next-line */
function showConnectICONexBtn(state, text) {
  const connectBtn = document.getElementById('connect-btn');
  const fromAddressText = document.getElementById('from-address');
  const logoutBtn = document.getElementById('logout-btn');

  if (state) {
    connectBtn.style.display = 'block';
    logoutBtn.style.display = 'none';
    fromAddressText.style.display = 'none';
  } else {
    connectBtn.style.display = 'none';
    logoutBtn.style.display = 'block';
    fromAddressText.innerText = text;
    fromAddressText.style.display = 'block';
  }
}

/* eslint-disable-next-line */
function onLogout() {
  localStorage.removeItem(FROM_ADDRESS);

  const connectBtn = document.getElementById('connect-btn');
  const fromAddressText = document.getElementById('from-address');
  const logoutBtn = document.getElementById('logout-btn');

  connectBtn.style.display = 'block';
  fromAddressText.style.display = 'none';
  logoutBtn.style.display = 'none';
}
