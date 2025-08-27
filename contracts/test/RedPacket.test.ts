import { expect } from "chai";
import { ethers } from "hardhat";

describe("RedPacket", function () {
  it("creates and claims a packet", async () => {
    const [owner, alice, bob] = await ethers.getSigners();
    const RedPacket = await ethers.getContractFactory("RedPacket");
    const red = await RedPacket.deploy();
    await red.waitForDeployment();

    const id = 1; // first id
    const total = ethers.parseEther("1");
    const count = 2n;
    await expect(
      red.connect(owner).createRedPacket(count, { value: total })
    ).to.emit(red, "RedPacketCreated");

    const beforeA = await ethers.provider.getBalance(alice.address);
    const txA = await red.connect(alice).claimRedPacket(id);
    const rcA = await txA.wait();
    const gasA = rcA!.gasUsed * rcA!.gasPrice!;
    const afterA = await ethers.provider.getBalance(alice.address);
    expect(afterA - beforeA + gasA).to.be.gt(0n);

    await expect(red.connect(alice).claimRedPacket(id)).to.be.revertedWith(
      "already claimed"
    );

    const txB = await red.connect(bob).claimRedPacket(id);
    await txB.wait();
    await expect(txB).to.emit(red, "RedPacketFinished").withArgs(id);
  });
});

