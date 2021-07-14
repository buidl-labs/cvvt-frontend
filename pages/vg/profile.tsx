import { useContractKit } from "@celo-tools/use-contractkit";
import React, { useEffect, useState } from "react";

import useStore from "../../store/vg-store";
import Layout from "../../components/vg/layout";
import { ValidatorGroup } from "../../lib/types";
import useVG from "../../hooks/useVG";

import Loading from "../../components/Loading";
import PerformanceMetricsPanel from "../../components/vg/PerformanceMetricPanel";
import ValidatorsPanel from "../../components/vg/ValidatorPanel";
import ProfileHeader from "../../components/vg/ProfileHeader";

export default function Edit() {
  const { address, network } = useContractKit();
  const state = useStore();
  const [VG, setVG] = useState<ValidatorGroup>();

  const { fetching, error, data: validatorGroup } = useVG(state.user);

  useEffect(() => {
    if (!fetching && !error && validatorGroup) {
      setVG(validatorGroup["ValidatorGroup"]);
    }
  }, [fetching, validatorGroup]);

  useEffect(() => {
    if (address == null) return;
    state.setNetwork(network.name);
    const GROUP = "0x15ed3f6b79f5fb9ef1d99d37314dd626b3005f0b";
    const TESTING_ADDRESS = "0x6f80f637896e7068ad28cc45d6810b1dc8b08cf5";
    if (address === "") return;
    if (address == TESTING_ADDRESS) {
      state.setUser(GROUP);
    } else {
      state.setUser(address);
    }
  }, [address]);

  return (
    <Layout>
      <>
        {VG && (
          <div className="text-gray-dark">
            <h1 className="text-2xl text-gray-dark font-medium">
              View Profile
            </h1>
            <p className="mt-5">
              This is how your profile is going to appear to Celo Holders:
            </p>
            <hr className="text-gray-light mt-5" />
            <div className="mt-10">
              <ProfileHeader VG={VG} />
            </div>
            <PerformanceMetricsPanel VG={VG} />
            <ValidatorsPanel VG={VG} />
          </div>
        )}
      </>
    </Layout>
  );
}
