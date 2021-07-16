import { ContractKit } from "@celo/contractkit";
import React, { useEffect, useState } from "react";
import { fetchEpochRewards, getEpochFromBlock } from "../../lib/celo";
import { EpochReward } from "../../lib/types";
import Select from "./select";
import { BigNumber } from "bignumber.js";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Transition } from "@headlessui/react";
import Loader from "react-loader-spinner";
import Link from "next/link";

enum STATES {
  idle,
  loading,
  noRewards,
  hasRewards,
}

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
  const [rewardsToShow, setRewardsToShow] = useState<any[]>([]);
  const [status, setStatus] = useState<number>(STATES.idle);

  useEffect(() => {
    setStatus(STATES.loading);

    fetchEpochRewards(kit, address).then((r) => {
      const rewardMap = r.reduce(
        (acc, val) => acc.set(val["epoch"], val["reward"]),
        new Map<number, BigNumber>()
      );
      setRewards(rewardMap);
      setStatus(rewardMap.size > 0 ? STATES.hasRewards : STATES.noRewards);
    });
  }, []);

  useEffect(() => {
    console.log("status", status);
  }, [status]);
  async function setDataForGraph() {
    const blockN = await kit.web3.eth.getBlockNumber();
    const epochNow = getEpochFromBlock(blockN, 17280);
    let fromEpoch;
    if (selected == OPTIONS[0]) {
      fromEpoch = epochNow - 7;
    } else if (selected == OPTIONS[1]) {
      fromEpoch = epochNow - 30;
    } else {
      fromEpoch = Math.min(...Array.from(rewards.keys()));
    }

    const rewardsDisplay = new Array<any>();
    let currentReward = new BigNumber(0);
    for (let epoch = fromEpoch; epoch < epochNow; epoch++) {
      currentReward = currentReward.plus(
        rewards.get(epoch) || new BigNumber(0)
      );

      rewardsDisplay.push({
        epoch,
        reward: currentReward.div(1e18).toNumber().toFixed(4),
      });
    }
    setRewardsToShow(rewardsDisplay);
  }

  useEffect(() => {
    if (rewards.size == 0) return;
    setDataForGraph();
  }, [rewards, selected]);

  return (
    <div className="mt-10 px-10 py-8 border border-gray-light rounded-md relative overflow-hidden">
      <Transition
        show={status !== STATES.hasRewards}
        enter="transition-opacity duration-100"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="absolute z-20 inset-y-0 inset-x-0 bg-white  bg-opacity-90 flex items-center justify-center">
          {status == STATES.loading && (
            <div className="flex flex-col items-center space-y-4">
              <Loader type="Puff" color="#35d07f" height={60} width={60} />
              <h3 className="text-xl">Loading your past rewards</h3>
            </div>
          )}
          {status == STATES.noRewards && (
            <div className="flex flex-col items-center space-y-4">
              <h3 className="text-xl">
                Sorry, you've no past rewards to show yet 🥲
              </h3>
              <Link href="/app/invest" passHref>
                <a className="bg-primary inline-block px-14 py-3 rounded-md text-white text-base shadow-sm hover:bg-primary-dark transition-all">
                  Start Investing
                </a>
              </Link>
            </div>
          )}
        </div>
      </Transition>
      <Header selected={selected} setSelected={setSelected} />
      <RewardsGraph rewards={rewardsToShow} />
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

const RewardsGraph = ({ rewards }: { rewards: any[] }) => (
  <div className="flex items-center justify-center mt-10">
    <ResponsiveContainer width={"100%"} aspect={4}>
      <LineChart
        data={rewards}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
      >
        <CartesianGrid stroke="#dedede" strokeDasharray="5 5" />
        <XAxis dataKey="epoch" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="reward"
          name="Reward"
          stroke="#82ca9d"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);
