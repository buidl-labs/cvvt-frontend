import { useContractKit } from "@celo-tools/use-contractkit";
import React, { useEffect, useMemo, useState } from "react";
import useStore from "../../store/vg-store";
import Layout from "../../components/vg/layout";
import { ValidatorGroup } from "../../lib/types";
import useVG from "../../hooks/useVG";
import WelcomeHeading from "../../components/vg/welcome-heading";
import TransparencyScoreBar from "../../components/vg/transparency-score-bar";
import VGEditForm from "../../components/vg/vg-edit-form";

export default function Edit() {
  const { connect, address, network } = useContractKit();
  const state = useStore();
  const userConnected: boolean = useMemo(
    () => state.user.length > 0,
    [state.user]
  );
  const [VG, setVG] = useState<ValidatorGroup>();

  const { fetching, error, data: validatorGroup } = useVG(state.user);

  useEffect(() => {
    if (!fetching && !error && validatorGroup) {
      setVG(validatorGroup["ValidatorGroup"]);
    }
  }, [fetching, validatorGroup]);

  useEffect(() => {
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
        {VG ? (
          <div>
            <WelcomeHeading name={VG.Name} address={VG.Address} />
            <TransparencyScoreBar score={Number(VG.TransparencyScore)} />
            <VGEditForm VG={VG} />
          </div>
        ) : (
          "loading"
        )}
      </>
    </Layout>
  );
}
