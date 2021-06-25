import { useContractKit } from "@celo-tools/use-contractkit";
import React, { useEffect, useMemo, useRef, useState } from "react";
import useStore from "../../store/vg-store";
import Layout from "../../components/vg/layout";
import { ValidatorGroup } from "../../lib/types";
import useVG from "../../hooks/useVG";
import WelcomeHeading from "../../components/vg/welcome-heading";
import TransparencyScoreBar from "../../components/vg/transparency-score-bar";
import VGEditForm from "../../components/vg/vg-edit-form";

import { createMachine } from "xstate";
import { useMachine } from "@xstate/react";
import Loading from "../../components/Loading";

const EditMachine = createMachine({
  id: "EditMachine",
  initial: "loading",
  states: {
    loading: {
      on: { NEXT: "idle", ERROR: "error" },
    },
    idle: {
      on: { NEXT: "updating" },
    },
    updating: {
      on: { NEXT: "idle", ERROR: "error" },
    },
    error: {
      on: { NEXT: "idle" },
    },
  },
});

export default function Edit() {
  const [current, send] = useMachine(EditMachine);
  console.log(current.value);
  const { address, network } = useContractKit();
  const state = useStore();
  const [VG, setVG] = useState<ValidatorGroup>();
  // const userConnected: boolean = useMemo(
  //   () => state.user.length > 0,
  //   [state.user]
  // );
  const { fetching, error, data: validatorGroup } = useVG(state.user);
  const effectRunCount = useRef(0);

  useEffect(() => {
    if (!fetching && !error && validatorGroup) {
      effectRunCount.current++;
      if (effectRunCount.current === 1) {
        console.log("loading complete.");
        send("NEXT");
      }

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

  useEffect(() => {
    console.log(current.value);
  }, [current.value]);

  return (
    <Layout>
      <>
        <Loading
          open={current.matches("updating") || current.matches("loading")}
        />

        {VG && (
          <div>
            <WelcomeHeading name={VG.Name} address={VG.Address} />
            <TransparencyScoreBar score={Number(VG.TransparencyScore)} />
            <VGEditForm VG={VG} setVG={setVG} send={send} />
          </div>
        )}
      </>
    </Layout>
  );
}
