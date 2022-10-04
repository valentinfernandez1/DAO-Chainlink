import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

const deployBoxContract: DeployFunction = async (
  hre: HardhatRuntimeEnvironment
) => {
  const { getNamedAccounts, deployments, network } = hre;
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;

  log("Deploying Box contract.....\n");
  const Box = await deploy("Box", {
    from: deployer,
    args: [],
    log: true,
    //waitConfirmations: 3 |tells to wait x amount of blocks before assuming is deployed.
  });

  log(
    `-----------------\n03 - Deployed 'Box Contract' at ${Box.address}-----------------`
  );

  const boxContract = await ethers.getContractAt("Box", Box.address);
  const timelock = await ethers.getContract("TimeLock");

  const transferTx = await boxContract.transferOwnership(timelock.address);
  await transferTx.wait(1);

  log(
    `Ownership of "Box" transfered to "Timelock" contract(address: ${timelock.address})`
  );
};

export default deployBoxContract;
deployBoxContract.tags = ["all", "box"];
