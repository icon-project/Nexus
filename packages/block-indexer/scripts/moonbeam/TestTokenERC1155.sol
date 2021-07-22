// SPDX-License-Identifier: MIT
// TestTokenERC1155
// 0x66706229f934190Bd179Bf4AD7CA38B2b2CFD3Ca

pragma solidity ^0.8.2;

// yarn add @openzeppelin/contracts
import "node_modules/@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract TestTokenERC1155 is ERC1155, Ownable {
    constructor() ERC1155("http://testtokenerc1155.com") {}

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function mint(address account, uint256 id, uint256 amount, bytes memory data)
        public
        onlyOwner
    {
        _mint(account, id, amount, data);
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        public
        onlyOwner
    {
        _mintBatch(to, ids, amounts, data);
    }
}
