# python -m pip install py-solc-x

import solcx

# If you haven't already installed the Solidity compiler, uncomment the following line
solcx.install_solc()

# Compile contract
temp_file = solcx.compile_files('TestTokenERC1155.sol')

# Export contract data
print(temp_file['TestTokenERC1155.sol:TestTokenERC1155']['contract_id'])

abi = temp_file['TestTokenERC1155.sol:TestTokenERC1155']['abi']
bytecode = temp_file['TestTokenERC1155.sol:TestTokenERC1155']['bin']
