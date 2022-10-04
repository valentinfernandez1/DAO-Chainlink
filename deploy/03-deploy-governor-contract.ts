import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import {
  QUORUM_PERCENT,
  VOTING_DELAY,
  VOTING_PERIOD,
} from "../hardhat-helper-config";

const deployGovernorContract: DeployFunction = async (
  hre: HardhatRuntimeEnvironment
) => {
  const { getNamedAccounts, deployments, network } = hre;
  const { deployer } = await getNamedAccounts();
  const { deploy, log, get } = deployments;

  const governanceToken = await get("GovernanceToken");
  const timelock = await get("TimeLock");

  log("Deploying the GovernorContract contract.....\n");
  const GovernorContract = await deploy("GovernorContract", {
    from: deployer,
    args: [
      governanceToken.address,
      timelock.address,
      VOTING_DELAY,
      VOTING_PERIOD,
      QUORUM_PERCENT,
    ],
    log: true,
    //waitConfirmations: 3 |tells to wait x amount of blocks before assuming is deployed.
  });

  log(
    `-----------------\n03 - Deployed 'Governor Contract' at ${GovernorContract.address}-----------------`
  );
};

export default deployGovernorContract;
deployGovernorContract.tags = ["all"];
