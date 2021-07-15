import React from "react";
import { EpochReward } from "../../lib/types";

function EpochRewardGraph({
  address,
  rewards,
}: {
  address: string | null;
  rewards: EpochReward[];
}) {
  return (
    <div>
      <pre>
        <code>{JSON.stringify(rewards, null, 2)}</code>
      </pre>
    </div>
  );
}

export default EpochRewardGraph;
