from web3 import Web3

#
# -- Define Provider & Variables --
#
# Provider
provider_rpc = {
    "development": "http://localhost:9933",
    "alphanet": "https://rpc.testnet.moonbeam.network",
}
web3 = Web3(Web3.HTTPProvider(provider_rpc["development"]))  # Change to correct network

# Variables
address_from = "0xFf64d3F6efE2317EE2807d223a0Bdc4c0c49dfDB"
address_to = "0xa6A2E181b4e981b036aB8A787A3E348ABdfcFc96"

#
#  -- Balance Call Function --
#
balance_from = web3.fromWei(web3.eth.getBalance(address_from), "ether")
balance_to = web3.fromWei(web3.eth.getBalance(address_to), "ether")

print(f"The balance of { address_from } is: { balance_from } DEV")
print(f"The balance of { address_to } is: { balance_to } DEV")
