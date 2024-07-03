// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/math/Math.sol";

/** Inspired by https://ethernaut.openzeppelin.com/level/10 */

contract EtherVault {
    using Math for uint256;
    

    mapping(address => uint256) public balances;

    function donate(address _to) public payable {
        (bool success, uint256 result) = balances[_to].tryAdd(msg.value);
        require(success, "Invalid Math operation.");
        balances[_to] = result;
    }

    function balanceOf(address _who) public view returns (uint256 balance) {
        return balances[_who];
    }

    function withdraw(uint256 _amount) public {
        if (balances[msg.sender] >= _amount) {
            (bool result,) = msg.sender.call{value: _amount}("");
            if (result) {
                _amount;
            }
            balances[msg.sender] -= _amount;
        }
    }

    receive() external payable {}
}
