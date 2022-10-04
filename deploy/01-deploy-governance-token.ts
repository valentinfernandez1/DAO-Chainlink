import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

const deployGovernanceToken: DeployFunction = async (
  hre: HardhatRuntimeEnvironment
) => {
  const { getNamedAccounts, deployments, network } = hre;
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;

  log("Deploying GovernanceToken");
  const governanceToken = await deploy("GovernanceToken", {
    from: deployer,
    args: [],
    log: true,
    //waitConfirmations: 3 |tells to wait x amount of blocks before assuming is deployed.
  });

  log(
    `----------------- \n01 - Deployed 'GovernanceToken' at ${governanceToken.address}\n-----------------`
  );

  //delegate
  await delegate(governanceToken.address, deployer);
  console.log("01-Delegated");
};

export default deployGovernanceToken;
deployGovernanceToken.tags = ["all", "governanceToken"];

const delegate = async (
  governaceTokenAddress: string,
  delegatedAccount: string
) => {
  const governanceToken = await ethers.getContractAt(
    "GovernanceToken",
    governaceTokenAddress
  );
  const txResponse = await governanceToken.delegate(delegatedAccount);
  await txResponse.wait(1);

  console.log(
    `Checkpoints: ${await governanceToken.numCheckpoints(delegatedAccount)}`
  );
};
