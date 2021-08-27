import React, { useEffect, useMemo, useState } from "react";
import { useContractKit } from "@celo-tools/use-contractkit";
import Layout from "../../components/vg/layout";
import useStore from "../../store/vg-store";
import useVGList from "../../hooks/useVGAddressList";
import CheckingVG from "../../components/vg/dialogs/checking-vg";
import Link from "next/link";
import VGDash from "../../components/vg/dash";
import VGMapping from "../../vg-mapping";

function Dashboard() {
  const { connect, address, network } = useContractKit();
  const state = useStore();
  const userConnected: boolean = !(address == null);
  const {
    validatorGroups,
    loading: vgListLoading,
  }: { validatorGroups: string[]; loading: boolean } = useVGList();

  const [isVG, setIsVG] = useState(false);
  useEffect(() => {
    if (address == null) return;
    state.setUser(address);
    state.setNetwork(network.name);
  }, [address]);

  useEffect(() => {
    console.log(VGMapping.map((vg) => vg.Beneficiary));

    const GROUP = "0xf83c93ea360b66ddcd532960304948b1c10786a1";
    const TESTING_ADDRESS = [
      "0x6f80f637896e7068ad28cc45d6810b1dc8b08cf5",
      "0xcecdcb570c5433d8ba004b7a5a793cc97aa517b6",
      "0x3a85a88a1d7ced078066ce8f9cd524e965265b1e",
      "0xec687AF2f05e6472BfE3eD63Bef9261609040700",
    ];
    if (address == null || vgListLoading) return;
    if (TESTING_ADDRESS.includes(address)) {
      setIsVG(true);
      state.setUser(GROUP);
    } else {
      if (validatorGroups.map((a) => a.toLowerCase()).includes(address)) {
        setIsVG(true);
        state.setUser(address);
      } else {
        const VGAccount = VGMapping.find(
          (vg) => vg.Beneficiary.toLowerCase() === address
        );
        if (VGAccount) {
          setIsVG(true);
          state.setUser(VGAccount.ContractAddress.toLowerCase());
        }
      }
    }
  }, [address, vgListLoading]);

  return (
    <Layout>
      <>
        <CheckingVG dialogOpen={userConnected && !isVG && vgListLoading} />
        {!userConnected ? (
          <div>
            <div>
              <h3 className="text-2xl font-medium">Welcome!</h3>
              <p className="mt-2.5 text-gray text-lg">
                Please connect the Celo Wallet of your Validator Group to log in
                to your profile. <br />
                If your group address is a{" "}
                <span className="text-secondary-dark">ReleaseGold</span>{" "}
                contract, connect the address of the beneficiary to log in to
                your profile:
              </p>
            </div>
            <div className="mt-24 flex flex-col justify-center items-center">
              <img src="/assets/wallet.svg" />
              <button
                className="text-white bg-primary rounded-md px-10 py-3 mt-14 space-x-3 flex items-center"
                onClick={async () => await connect()}
              >
                <img src="/assets/celo-wallet.png" />
                <span>Connect Celo Wallet</span>
              </button>
            </div>
          </div>
        ) : (
          <div id="app-div">
            {(() => {
              if (!vgListLoading) {
                if (isVG) {
                  return (
                    <div>
                      <VGDash />
                    </div>
                  );
                } else {
                  return (
                    <div>
                      <h3 className="text-2xl font-medium">
                        Oops, your account is not a validator group.
                      </h3>
                      <p className="text-gray-dark mt-2 text-lg">
                        It seems like this account is not registered as a
                        Validator Group. Try logging in as a CELO Holder
                        instead?
                      </p>
                      <Link href="/app/dashboard" passHref>
                        <a className="mt-6 text-white text-lg bg-primary rounded-md px-10 py-3 inline-block">
                          Login as a CELO holder
                        </a>
                      </Link>
                    </div>
                  );
                }
              }
            })()}
          </div>
        )}
      </>
    </Layout>
  );
}

export default Dashboard;
