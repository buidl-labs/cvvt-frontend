import Link from "next/link";
import React, { useEffect, useState } from "react";
import useVG from "../../hooks/useVG";
import { Validator, ValidatorGroup } from "../../lib/types";
import useStore from "../../store/vg-store";
import PerformanceMetricsPanel from "./PerformanceMetricPanel";
import TransparencyScoreBar from "./transparency-score-bar";
import ValidatorsPanel from "./ValidatorPanel";
import WelcomeHeading from "./welcome-heading";

const formatter = new Intl.NumberFormat("en-US");
export default function VGDash() {
  const [VG, setVG] = useState<ValidatorGroup>();
  const user = useStore((state) => state.user);
  const { fetching, error, data: validatorGroup } = useVG(user);
  console.log(fetching, error, validatorGroup);

  useEffect(() => {
    if (!fetching && !error) {
      setVG(validatorGroup["ValidatorGroup"]);
    }
  }, [fetching, validatorGroup]);

  return (
    <>
      {(() => {
        if (error) {
          console.log(error);
        } else if (!fetching && VG) {
          return (
            <>
              <WelcomeHeading name={VG.Name} address={VG.Address} />
              <TransparencyScoreBar score={Number(VG.TransparencyScore)} />
              <NavButtons />
              <PerformanceMetricsPanel VG={VG} />
              <ValidatorsPanel VG={VG} />
            </>
          );
        }
      })()}
    </>
  );
}

function NavButtons() {
  return (
    <div className="mt-10 space-x-4 text-center">
      <Link href="/vg/edit" passHref>
        <a className="inline-block px-11 py-3 border-2 border-primary bg-primary text-white font-medium rounded-md">
          Complete Your Profile
        </a>
      </Link>
      <Link href="/vg/profile" passHref>
        <a className="inline-block px-11 py-3 bg-white text-primary border-2 border-primary font-medium rounded-md">
          View Your Profile
        </a>
      </Link>
    </div>
  );
}
