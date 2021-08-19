import { useContractKit } from "@celo-tools/use-contractkit";
import React, { useEffect, useState } from "react";

import useStore from "../../store/vg-store";
import Layout from "../../components/vg/layout";
import { ValidatorGroup } from "../../lib/types";
import useVG from "../../hooks/useVG";
import Head from "next/head";
import CODE from "../../widget-code";
import Loading from "../../components/Loading";
import CopyIcon from "../../components/icons/copy";
import { toast } from "react-toastify";

const CodeBlock = ({ snippet }: { snippet: string }) => {
  return (
    <pre className="relative p-4 pt-8 pr-8 bg-gray-light border-2 border-gray rounded-md">
      <button
        onClick={() => {
          navigator.clipboard.writeText(snippet);
          toast.success("Code for the widget has been copied!");
        }}
        className="absolute top-4 right-4"
      >
        <CopyIcon size="lg" color="text-gray-dark" />
      </button>
      {snippet}
    </pre>
  );
};

export default function Widgets() {
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
    <>
      <Head>
        <script
          src="https://unpkg.com/churrofi-widgets@0.0.9/dist/churrofi-widgets-xl.js?module"
          type="module"
        />
        <script
          src="https://unpkg.com/churrofi-widgets@0.0.9/dist/churrofi-widgets-lg.js?module"
          type="module"
        />
        <script
          src="https://unpkg.com/churrofi-widgets@0.0.9/dist/churrofi-widgets-md.js?module"
          type="module"
        />
        <script
          src="https://unpkg.com/churrofi-widgets@0.0.9/dist/churrofi-widgets-sm.js?module"
          type="module"
        />
        <script
          src="https://unpkg.com/churrofi-widgets@0.0.9/dist/churrofi-widgets-xs.js?module"
          type="module"
        />
      </Head>

      <Layout>
        <div className="text-gray-dark">
          {VG ? (
            <>
              <header>
                <h1 className="text-2xl text-gray-dark font-medium">Widgets</h1>
                <p className="mt-5">
                  Choose from a wide range of Voting Wigets based on your
                  website’s theme & available space, to make it easy for CELO
                  Holders to vote.
                </p>
                {/* <TabGroup selected={selected} setSelected={setSelected} /> */}
              </header>
              <main className="mt-5 text-gray-dark space-y-10">
                <section className="border border-gray-light p-10 rounded-md">
                  <h3 className="text-xl font-medium">Extra Large Widgets</h3>
                  <div className="mt-5 space-y-10">
                    <div className="grid grid-cols-2">
                      <churrofi-widgets-xl
                        address={VG.Address}
                        name={VG.Name}
                      />

                      <CodeBlock
                        snippet={CODE("xl", VG.Address, VG.Name, false)}
                      />
                    </div>
                    <div className="grid grid-cols-2">
                      <churrofi-widgets-xl
                        address={VG.Address}
                        name={VG.Name}
                        theme="green"
                      />

                      <CodeBlock
                        snippet={CODE("xl", VG.Address, VG.Name, true)}
                      />
                    </div>
                  </div>
                </section>
                <section className="border border-gray-light p-10 rounded-md">
                  <h3 className="text-xl font-medium">Large Widgets</h3>
                  <div className="mt-5 space-y-10">
                    <div className="grid grid-cols-2">
                      <churrofi-widgets-lg
                        address={VG.Address}
                        name={VG.Name}
                      />

                      <CodeBlock
                        snippet={CODE("lg", VG.Address, VG.Name, false)}
                      />
                    </div>
                    <div className="grid grid-cols-2">
                      <churrofi-widgets-lg
                        address={VG.Address}
                        name={VG.Name}
                        theme="green"
                      />

                      <CodeBlock
                        snippet={CODE("lg", VG.Address, VG.Name, true)}
                      />
                    </div>
                  </div>
                </section>
                <section className="border border-gray-light p-10 rounded-md">
                  <h3 className="text-xl font-medium">Medium Widgets</h3>
                  <div className="mt-5 space-y-10">
                    <div className="grid grid-cols-2">
                      <churrofi-widgets-md
                        address={VG.Address}
                        name={VG.Name}
                      />

                      <CodeBlock
                        snippet={CODE("md", VG.Address, VG.Name, false)}
                      />
                    </div>
                    <div className="grid grid-cols-2">
                      <churrofi-widgets-md
                        address={VG.Address}
                        name={VG.Name}
                        theme="green"
                      />

                      <CodeBlock
                        snippet={CODE("md", VG.Address, VG.Name, true)}
                      />
                    </div>
                  </div>
                </section>
                <section className="border border-gray-light p-10 rounded-md">
                  <h3 className="text-xl font-medium">Small Widgets</h3>
                  <div className="mt-5 space-y-10">
                    <div className="grid grid-cols-2">
                      <churrofi-widgets-sm
                        address={VG.Address}
                        name={VG.Name}
                      />

                      <CodeBlock
                        snippet={CODE("sm", VG.Address, VG.Name, false)}
                      />
                    </div>
                    <div className="grid grid-cols-2">
                      <churrofi-widgets-sm
                        address={VG.Address}
                        name={VG.Name}
                        theme="green"
                      />

                      <CodeBlock
                        snippet={CODE("sm", VG.Address, VG.Name, true)}
                      />
                    </div>
                  </div>
                </section>
                <section className="border border-gray-light p-10 rounded-md">
                  <h3 className="text-xl font-medium">Extra Small Widgets</h3>
                  <div className="mt-5 space-y-10">
                    <div className="grid grid-cols-2">
                      <churrofi-widgets-xs
                        address={VG.Address}
                        name={VG.Name}
                      />

                      <CodeBlock
                        snippet={CODE("xs", VG.Address, VG.Name, false)}
                      />
                    </div>
                    <div className="grid grid-cols-2">
                      <churrofi-widgets-xs
                        address={VG.Address}
                        name={VG.Name}
                        theme="green"
                      />
                      <CodeBlock
                        snippet={CODE("xs", VG.Address, VG.Name, false)}
                      />
                    </div>
                  </div>
                </section>
              </main>
            </>
          ) : (
            <Loading open={!VG} />
          )}
        </div>
      </Layout>
    </>
  );
}
