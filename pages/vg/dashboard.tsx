import React, { useEffect, useMemo, useState } from "react";
import { useContractKit } from "@celo-tools/use-contractkit";
import Layout from "../../components/vg/layout";
import useStore from "../../store/vg-store";
import useVGList from "../../hooks/useVGAddressList";
import CheckingVG from "../../components/vg/dialogs/checking-vg";
import Link from "next/link";
import VGDash from "../../components/vg/dash";

function Dashboard() {
  const { connect, address, network } = useContractKit();
  const state = useStore();
  const userConnected: boolean = useMemo(() => address.length > 0, [address]);
  const {
    validatorGroups,
    loading: vgListLoading,
  }: { validatorGroups: string[]; loading: boolean } = useVGList();

  const [isVG, setIsVG] = useState(false);
  useEffect(() => {
    state.setUser(address);
    state.setNetwork(network.name);
  }, [address]);

  useEffect(() => {
    const GROUP = "0x15ed3f6b79f5fb9ef1d99d37314dd626b3005f0b";
    const TESTING_ADDRESS = "0x6f80f637896e7068ad28cc45d6810b1dc8b08cf5";
    if (address === "" || vgListLoading) return;
    if (address == TESTING_ADDRESS) {
      setIsVG(true);
      state.setUser(GROUP);
    } else {
      if (validatorGroups.includes(address)) {
        setIsVG(true);
        state.setUser(address);
      }
    }
  }, [address, vgListLoading]);

  return (
    <Layout>
      <>
        <CheckingVG dialogOpen={!isVG && vgListLoading} />
        {!userConnected ? (
          <div>
            <div>
              <h3 className="text-2xl font-medium">Welcome, celo holder!</h3>
              <p className="mt-2.5 text-gray text-lg">
                Please connect the Celo Wallet of your Validator Group to log in
                to your profile:
              </p>
            </div>
            <div className="mt-24 flex flex-col justify-center items-center">
              <img src="/assets/wallet.png" />
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
