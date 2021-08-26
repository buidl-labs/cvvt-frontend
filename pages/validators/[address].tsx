import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Nav from "../../components/home/nav";
import useVG from "../../hooks/useVG";
import { ValidatorGroup } from "../../lib/types";
import ProfileHeader from "../../components/vg/ProfileHeader";
import PerformanceMetricsPanel from "../../components/vg/PerformanceMetricPanel";
import ValidatorsPanel from "../../components/vg/ValidatorPanel";
import Link from "next/link";

function ValidatorGroupPage() {
  const address = useRouter().query.address;
  const [VG, setVG] = useState<ValidatorGroup>();

  const { fetching, error, data: validatorGroup } = useVG(String(address));

  useEffect(() => {
    if (!fetching && !error && validatorGroup) {
      setVG(validatorGroup["ValidatorGroup"]);
    }
  }, [fetching, validatorGroup]);

  return (
    <>
      <Nav />
      {VG && (
        <div className="relative px-40 mt-48 mb-24">
          <ProfileHeader VG={VG} />
          <PerformanceMetricsPanel VG={VG} />
          <ValidatorsPanel VG={VG} />
          <Link href={`/app/invest?vg=${VG.Address}`} passHref>
            <a
              target="_blank"
              className="fixed bottom-20 right-40 bg-primary hover:bg-primary-dark focus:bg-primary-dark active:bg-primary-dark-dark focus:outline-none px-14 py-3 rounded-md text-white text-lg font-medium shadow-sm transition-all"
            >
              Stake on {VG.Name ? VG.Name : `${VG.Address.slice(0, 8)}...`}
            </a>
          </Link>
        </div>
      )}
    </>
  );
}

export default ValidatorGroupPage;
