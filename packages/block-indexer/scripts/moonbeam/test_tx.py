# python -m pip install web3

from web3 import Web3

#
# -- Define Provider & Variables --
#

# Provider
provider_rpc = {
  "development": "http://localhost:9933",
  "alphanet": "https://rpc.testnet.moonbeam.network"
}

# Change to correct network
web3 = Web3(Web3.HTTPProvider(provider_rpc["development"]))

# Ethan
account_from = {
  "private_key": "7dce9bc8babb68fec1409be38c8e1a52650206a7ed90ff956ae8a6d15eeaaef4",
  "address": "0xFf64d3F6efE2317EE2807d223a0Bdc4c0c49dfDB"
}

address_to = "0xa6A2E181b4e981b036aB8A787A3E348ABdfcFc96"  # Tien

#
#  -- Create and Deploy Transaction --
#
print(f'Attempting to send transaction from { account_from["address"] } to { address_to }')

# Sign Tx with PK
tx_create = web3.eth.account.signTransaction({
    "nonce": web3.eth.getTransactionCount(account_from["address"]),
    "gasPrice": 0,
    "gas": 21000,
    "to": address_to,
    "value": web3.toWei("1", "ether")
  },
  account_from["private_key"]
)

# Send Tx and Wait for Receipt
tx_hash = web3.eth.sendRawTransaction(tx_create.rawTransaction)
tx_receipt = web3.eth.waitForTransactionReceipt(tx_hash)

# Transaction successful with hash: 0xa765001b644550b29c016b301760e59d32059ce8214f8a281984777dad316117
print(f"Transaction successful with hash: { tx_receipt.transactionHash.hex() }")
