import { ContractKit } from "@celo/contractkit";
import React, { useEffect, useState } from "react";
import { fetchEpochRewards, getEpochFromBlock } from "../../lib/celo";
import { EpochReward } from "../../lib/types";
import Select from "./select";
import { BigNumber } from "bignumber.js";
import { AccountClaimType } from "@celo/contractkit/lib/identity/claims/account";

const OPTIONS = ["7 days", "30 days", "All time"];
function EpochRewardGraph({
  address,
  kit,
}: {
  address: string | null;
  kit: ContractKit;
}) {
  const [selected, setSelected] = useState<string>(OPTIONS[0]);
  const [rewards, setRewards] = useState<Map<number, BigNumber>>(
    new Map<number, BigNumber>()
  );
  const [rewardsToShow, setRewardsToShow] = useState<EpochReward[]>([]);

  useEffect(() => {
    fetchEpochRewards(kit, address).then((r) => {
      const rewardMap = r.reduce(
        (acc, val) => acc.set(val["epoch"], val["reward"]),
        new Map<number, BigNumber>()
      );
      setRewards(rewardMap);
    });
  }, []);

  async function setDataForGraph() {
    const blockN = await kit.web3.eth.getBlockNumber();
    const epochNow = getEpochFromBlock(blockN, 17280);
    let fromEpoch;
    if (selected == OPTIONS[0]) {
      // Calculate rewards for last 7 days
      fromEpoch = epochNow - 7;
      // const rewardsDisplay = new Array<EpochReward>();

      // for (let i = fromEpoch; i < epochNow; i++) {
      //   rewardsDisplay.push({
      //     epoch: i,
      //     reward: rewards.get(i) || new BigNumber(0),
      //   });
      // }
      // setRewardsToShow(rewardsDisplay);
    } else if (selected == OPTIONS[1]) {
      // Calculate rewards for last 30 days
      fromEpoch = epochNow - 30;
      // const rewardsDisplay = new Array<EpochReward>();
      // for (let i = fromEpoch; i < epochNow; i++) {
      //   rewardsDisplay.push({
      //     epoch: i,
      //     reward: rewards.get(i) || new BigNumber(0),
      //   });
      // }
      // setRewardsToShow(rewardsDisplay);
    } else {
      // Calculate rewards All Time
      fromEpoch = Math.min(...Array.from(rewards.keys()));
    }

    const rewardsDisplay = new Array<EpochReward>();
    let currentReward = new BigNumber(0);
    for (let epoch = fromEpoch; epoch < epochNow; epoch++) {
      currentReward = currentReward.plus(
        rewards.get(epoch) || new BigNumber(0)
      );

      rewardsDisplay.push({
        epoch,
        reward: currentReward,
      });
    }
    setRewardsToShow(rewardsDisplay);
  }

  useEffect(() => {
    if (rewards.size == 0) return;
    setDataForGraph();
  }, [rewards, selected]);

  return (
    <div className="bg-accent-light-light mt-10 px-10 py-8 border border-gray-light rounded-md">
      <Header selected={selected} setSelected={setSelected} />
      <pre>
        {JSON.stringify(
          rewardsToShow.map((r) => ({
            epoch: r["epoch"],
            reward: r["reward"].div(1e18).toString(),
          })),
          null,
          2
        )}
      </pre>
    </div>
  );
}

const Header = ({
  selected,
  setSelected,
}: {
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
}) => (
  <div className="flex justify-between items-center">
    <h3 className="text-gray-dark text-xl font-medium">
      Profits earned on Invested CELO
    </h3>
    <div className="w-1/4">
      <Select
        options={OPTIONS}
        selected={selected}
        setSelected={setSelected}
        showLabel={false}
      />
    </div>
  </div>
);

export default EpochRewardGraph;
