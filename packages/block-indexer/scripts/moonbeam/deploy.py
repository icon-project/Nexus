from compile import abi, bytecode
from web3 import Web3

#
# -- Define Provider & Variables --
#
# Provider
provider_rpc = {
    'development': 'http://localhost:9933',
    'alphanet': 'https://rpc.testnet.moonbeam.network',
}
web3 = Web3(Web3.HTTPProvider(provider_rpc['development']))  # Change to correct network

# Ethan
account_from = {
  "private_key": "7dce9bc8babb68fec1409be38c8e1a52650206a7ed90ff956ae8a6d15eeaaef4",
  "address": "0xFf64d3F6efE2317EE2807d223a0Bdc4c0c49dfDB"
}

#
#  -- Deploy Contract --
#
print(f'Attempting to deploy from account: { account_from["address"] }')

# Create Contract Instance
TestTokenERC1155 = web3.eth.contract(abi=abi, bytecode=bytecode)

# Build Constructor Tx
construct_txn = TestTokenERC1155.constructor().buildTransaction(
    {
        'from': account_from['address'],
        'nonce': web3.eth.getTransactionCount(account_from['address']),
    }
)

# Sign Tx with PK
tx_create = web3.eth.account.signTransaction(construct_txn, account_from['private_key'])

# Send Tx and Wait for Receipt
tx_hash = web3.eth.sendRawTransaction(tx_create.rawTransaction)
tx_receipt = web3.eth.waitForTransactionReceipt(tx_hash)

print(f'Contract deployed at address: { tx_receipt.contractAddress }')
# 0x66706229f934190Bd179Bf4AD7CA38B2b2CFD3Ca
