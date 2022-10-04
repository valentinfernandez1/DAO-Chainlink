import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { EXECUTORS, MIN_DELAY, PROPOSERS } from "../hardhat-helper-config";

const deployTimelock: DeployFunction = async (
  hre: HardhatRuntimeEnvironment
) => {
  const { getNamedAccounts, deployments, network } = hre;
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;

  log("Deploying the Timelock contract.....\n");
  const timelock = await deploy("TimeLock", {
    from: deployer,
    args: [MIN_DELAY, PROPOSERS, EXECUTORS],
    log: true,
    //waitConfirmations: 3 |tells to wait x amount of blocks before assuming is deployed.
  });

  log(
    `----------------- \n02 - Deployed 'Timelock' at ${timelock.address}\n-----------------`
  );
};

export default deployTimelock;
deployTimelock.tags = ["all", "timelock"];
