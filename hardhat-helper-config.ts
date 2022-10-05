// For Governor Contract
export const VOTING_DELAY: number = 1; // 1 block
export const VOTING_PERIOD: number = 2000; /*VotingPeriod - 1 week */
export const QUORUM_PERCENT: number = 4; //4% quorum percentage

// For TimeLock
export const MIN_DELAY: number = 3600;
export const PROPOSERS: string[] = [];
export const EXECUTORS: string[] = [];

// For Setting up Governance Contracts
export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

// Propose Script + Queue and Execute Script
export const FUNC = "store";
export const FUNC_ARGS = 100; // New value voted into Box.
export const DESCRIPTION = "Update stored value to 100";
export const PROPOSAL_FILE = "proposals.json";

// Voting Script
export const VOTE_REASON = "Cause Dao's score 100 for coolness";

//DEV CHAINS
export const developmentChains = ["hardhat", "localhost"];
