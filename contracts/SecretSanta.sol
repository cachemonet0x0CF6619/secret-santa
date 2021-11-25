// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract SecretSanta is ERC721, Ownable, IERC721Receiver {
    event Deposited(bool success, bytes data);

    using Address for address;

    struct Gift {
        address addr;
        address sender;
        uint256 tokenId;
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    ) public virtual override returns (bytes4) {
        return this.onERC721Received.selector;
    }

    uint256 giftCount = 0;
    address[] _niceList;
    mapping(address => Gift) gifts;
    mapping(address => bool) santas;

    constructor() ERC721("SecretSanta", "SANTA") {}

    // TODO: use VRF in next year's contract
    function random(
        uint256 min,
        uint256 max,
        uint256 seed
    ) public pure returns (uint256) {
        return min + (seed % (max - min + 1));
    }

    function withdraw() public {
        // TODO: require day of holiday or greater
        require(_niceList.length > 1, "Lonely elf");
        require(santas[msg.sender], "Grinch");

        // exclude sender from list
        address[] memory elfs;
        for (uint256 i = 0; i < giftCount; i++) {
            // exclude sender from bag
            if (_niceList[i] == msg.sender) continue;
            elfs[i] = _niceList[i];
        }
        require(_niceList.length - 1 == elfs.length, "Math is hard");

        // TODO: better random
        uint256 num = random(0, elfs.length, block.timestamp);
        address addr = elfs[num];
        Gift memory gift = gifts[addr];

        IERC721(gift.addr).safeTransferFrom(
            address(this),
            msg.sender,
            gift.tokenId
        );
    }

    function deposit(address addr, uint256 tokenId) public {
        // TODO: don't allow deposits after cut off date
        require(!santas[msg.sender], "Too generous");
        santas[msg.sender] = true;
        _niceList.push(msg.sender);

        Gift memory gift;
        gift.tokenId = tokenId;
        gift.addr = addr;
        gift.sender = msg.sender;
        gifts[msg.sender] = gift;
        giftCount++;

        IERC721(gift.addr).safeTransferFrom(msg.sender, address(this), tokenId);
        // can we mint a token for their participation?
    }

    function niceList() public view returns (address[] memory) {
        return _niceList;
    }

    // TODO: allow players to re-claim their deposit
}
