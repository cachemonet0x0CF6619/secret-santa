// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract SecretSanta is ERC721, Ownable, IERC721Receiver {
    using Address for address;

    event Deposited(bool success, address addr, uint256 tokenId);

    // @dev depositied gift metadata
    struct Gift {
        address head;
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

    uint256 supply = 0;
    address[] givers;
    mapping(address => Gift) gifts;
    mapping(address => bool) senders;

    constructor() ERC721("SecretSanta", "SANTA") {}

    function deposit(address addr, uint256 tokenId) public {
        // TODO: don't allow deposits after cut off date
        require(!senders[msg.sender], "Too generous");
        senders[msg.sender] = true;
        givers.push(msg.sender);

        Gift memory gift;
        gift.tokenId = tokenId;
        gift.head = addr;
        gift.sender = msg.sender;
        gifts[msg.sender] = gift;
        supply++;
        delete gift;

        IERC721(addr).safeTransferFrom(msg.sender, address(this), tokenId);
        // can we mint a token for their participation?
        // emit Deposited(true, addr, tokenId);
    }

    // TODO: use VRF
    function random(
        uint256 min,
        uint256 max,
        uint256 seed
    ) public pure returns (uint256) {
        return min + (seed % (max - min + 1));
    }

    function withdraw() public {
        // TODO: require day of holiday or greater
        require(supply > 1, "Lonely elf");
        require(senders[msg.sender], "Grinch");

        address addr = msg.sender;
        while (addr == msg.sender) {
            addr = givers[random(0, givers.length, block.timestamp)];
        }

        Gift memory gift = gifts[addr];

        // restrict eligibility and reduce supply
        senders[msg.sender] = false;
        supply--;

        IERC721(gift.head).safeTransferFrom(
            address(this),
            msg.sender,
            gift.tokenId
        );
        delete gift;
    }

    function gave(address a) public view returns (bool) {
        return senders[a];
    }

    // TODO: allow players to re-claim their deposit
}
