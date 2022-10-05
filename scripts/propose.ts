import * as fs from "fs";
import { ethers, network } from "hardhat";
import {
  FUNC,
  FUNC_ARGS,
  DESCRIPTION,
  VOTING_DELAY,
  developmentChains,
  PROPOSAL_FILE,
} from "../hardhat-helper-config";
import { moveBlocks } from "../helpers";

export const makeProposal = async (
  functionToCall: string,
  args: number[],
  proposalDescription: string
) => {
  const governor = await ethers.getContract("GovernorContract");
  const box = await ethers.getContract("Box");

  const encodedFunctionToCall = box.interface.encodeFunctionData(
    functionToCall,
    args
  );

  /*@Dev: Propose Recieves the arguments 
    - address[] memory targests, --> addresses of contracts to call.
    - uint256[] memory values,   --> Eth to send.
    - bytes[] memory calldatas,  --> Functions to call.
    - string memory description, --> Proposal description.
  */
  const proposeTx = await governor.propose(
    [box.address],
    [0],
    [encodedFunctionToCall],
    proposalDescription
  );

  const proposeReceipt = await proposeTx.wait(1);

  console.log(proposeTx);
  console.log(proposeReceipt);

  if (developmentChains.includes(network.name)) {
    await moveBlocks(VOTING_DELAY + 1);
  }

  const proposalId = proposeReceipt.events[0].args.proposalId;
  console.log("Proposal id is:", String(proposalId));

  fs.writeFileSync(
    PROPOSAL_FILE,
    JSON.stringify({
      [network.config.chainId!.toString()]: [proposalId.toString()],
    })
  );
};

makeProposal(FUNC, [FUNC_ARGS], DESCRIPTION)
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    process.exit(1);
  });
