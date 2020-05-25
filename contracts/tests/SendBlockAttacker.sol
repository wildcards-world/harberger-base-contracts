pragma solidity 0.5.17;

import "../HarbergerSteward.sol";


contract SendBlockAttacker {
    function buyOnBehalf(
        HarbergerSteward stewardAddress,
        uint256 tokenId,
        uint256 newPrice
    ) public payable {
        stewardAddress.buy.value(msg.value)(tokenId, newPrice, msg.value);
    }

    function withdrawDeposit(HarbergerSteward stewardAddress, uint256 amount)
        public
    {
        stewardAddress.withdrawDeposit(amount);
    }

    function() external payable {
        revert("I'm Malicious");
    }
}
