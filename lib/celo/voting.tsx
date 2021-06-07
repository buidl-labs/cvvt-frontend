import { ContractKit } from "@celo/contractkit";
import { GroupVote } from "@celo/contractkit/lib/wrappers/Election";

export const getVotingSummary = async (
  kit: ContractKit,
  address: string
): Promise<GroupVote[]> => {
  let groupVotes: GroupVote[] = [];
  const elections = await kit.contracts.getElection();
  const groupsVotedByAccount: string[] =
    await elections.getGroupsVotedForByAccount(address);

  for (let vg of groupsVotedByAccount) {
    const groupVote: GroupVote = await elections.getVotesForGroupByAccount(
      address,
      vg
    );
    groupVotes.push(groupVote);
  }

  return groupVotes;
};
