import { ethers, network } from "hardhat";
import {
  DESCRIPTION,
  developmentChains,
  FUNC,
  FUNC_ARGS,
  MIN_DELAY,
} from "../hardhat-helper-config";
import { moveBlocks, moveTime } from "../helpers";

export async function queueAndExecute(
  functionToCall: string,
  args: number[],
  proposalDescription: string
) {
  const box = await ethers.getContract("Box");
  const encodedFunctionToCall = box.interface.encodeFunctionData(
    functionToCall,
    args
  );

  //ProposalDescription must be a hash
  const descriptionHash = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes(proposalDescription)
  );

  //queue
  const governor = await ethers.getContract("GovernorContract");
  const queuedTx = await governor.queue(
    [box.address],
    [0],
    [encodedFunctionToCall],
    descriptionHash
  );
  queuedTx.wait(1);

  console.log("🚶🚶Proposal in queue...");

  if (developmentChains.includes(network.name)) {
    await moveTime(MIN_DELAY + 1);
    await moveBlocks(1);
  }

  //execute
  const executeTx = await governor.execute(
    [box.address],
    [0],
    [encodedFunctionToCall],
    descriptionHash
  );
  executeTx.wait(1);

  console.log("➡️ Executed...");
  console.log(`📦 Box value is ${await box.retrieve()}`);
}

queueAndExecute(FUNC, [FUNC_ARGS], DESCRIPTION)
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
