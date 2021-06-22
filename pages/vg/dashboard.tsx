import React, { useEffect, useMemo } from "react";
import { useContractKit } from "@celo-tools/use-contractkit";
import Layout from "../../components/vg/layout";
import useStore from "../../store/vg-store";
import useVGList from "../../hooks/useVGList";

function Dashboard() {
  const { connect, address, network } = useContractKit();
  const state = useStore();
  const userConnected = useMemo(() => address.length > 0, [address]);
  const validatorGroups: string[] = useVGList();

  useEffect(() => {
    state.setUser(address);
    state.setNetwork(network.name);
  }, [address]);

  useEffect(() => {
    console.log(validatorGroups);
  }, [validatorGroups]);
  return (
    <Layout>
      <>
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
          <div>
            <h3 className="text-2xl font-medium">Dashboard</h3>
            <pre>
              {JSON.stringify(
                { isVG: validatorGroups.includes(address), validatorGroups },
                null,
                2
              )}
            </pre>
          </div>
        )}
      </>
    </Layout>
  );
}

export default Dashboard;
