'use strict';

const { getRelayAddresses } = require('./repository');

const registeredRelays = new Map();

async function getRegisteredRelayMap() {
  if (0 === registeredRelays.size) {
    const relays = await getRelayAddresses();

    for (const relay of relays)
      registeredRelays.set(relay.toLowerCase(), relay);
  }

  return registeredRelays;
}

module.exports = {
  getRegisteredRelayMap
};
