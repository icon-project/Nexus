// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

// https://testnet.bscscan.com/address/0x03a323c620fa7690469351d0b86bdc3b2b6ebfe6

contract TiendqCoin {
    // The keyword "public" makes variables
    // accessible from other contracts
    address public minter;
    mapping (address => uint) public balances;

    // Events allow clients to react to specific
    // contract changes you declare
    event CoinSent(address indexed from, address indexed to, uint amount, bytes notes);
    event CoinMinted(address indexed from, address indexed to, uint amount, bytes notes);

    // Constructor code is only run when the contract
    // is created
    constructor() {
        minter = msg.sender;
    }

    // Sends an amount of newly created coins to an address
    // Can only be called by the contract creator
    function mint(address receiver, uint amount, bytes memory notes) public {
        require(msg.sender == minter, "Caller is not owner");
        balances[receiver] += amount;
        emit CoinMinted(msg.sender, receiver, amount, notes);
    }

    // Errors allow you to provide information about
    // why an operation failed. They are returned
    // to the caller of the function.
    error InsufficientBalance(uint requested, uint available);

    // Sends an amount of existing coins
    // from any caller to an address
    function send(address receiver, uint amount, bytes memory notes) public {
        if (amount > balances[msg.sender])
            revert InsufficientBalance({
                requested: amount,
                available: balances[msg.sender]
            });

        balances[msg.sender] -= amount;
        balances[receiver] += amount;
        emit CoinSent(msg.sender, receiver, amount, notes);
    }
}
