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
web3 = Web3(Web3.HTTPProvider(provider_rpc["development"]))  # Change to correct network

# Variables
account_from = {
    'private_key': '7dce9bc8babb68fec1409be38c8e1a52650206a7ed90ff956ae8a6d15eeaaef4',
    'address': '0xFf64d3F6efE2317EE2807d223a0Bdc4c0c49dfDB',
}
contract_address = '0x66706229f934190Bd179Bf4AD7CA38B2b2CFD3Ca'

#
#  -- Send Function --
#
print(
    f'Calling the mint() function in contract at address: { contract_address }'
)

# Create Contract Instance
TestTokenERC1155 = web3.eth.contract(address=contract_address, abi=abi)

# Build Increment Tx
mint_tx = TestTokenERC1155.functions.mint('0xFf64d3F6efE2317EE2807d223a0Bdc4c0c49dfDB', 0, 5, '0x12345678').buildTransaction(
    {
        'from': account_from['address'],
        'nonce': web3.eth.getTransactionCount(account_from['address']),
    }
)

# Sign Tx with PK
tx_create = web3.eth.account.signTransaction(mint_tx, account_from['private_key'])

# Send Tx and Wait for Receipt
tx_hash = web3.eth.sendRawTransaction(tx_create.rawTransaction)
tx_receipt = web3.eth.waitForTransactionReceipt(tx_hash)

print(f'Tx successful with hash: { tx_receipt.transactionHash.hex() }')
