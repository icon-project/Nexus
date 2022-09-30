// SPDX-License-Identifier: MIT
// MyTokenERC1155
// 0x7a9BB233a1Df3641d125F1aA80Bb3938504a849c
// transaction hash
// 0x3dcfa54b54df5d7ef2d111e61c78df4fc2c1681804874194bd0836bfc9f3f133

pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyTokenERC1155 is ERC1155, Ownable {
    constructor() ERC1155("http://mytokenerc1155.com") {}

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
