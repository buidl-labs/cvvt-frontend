import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Nav from "../../components/home/nav";
import useVG from "../../hooks/useVG";
import { ValidatorGroup } from "../../lib/types";
import ProfileHeader from "../../components/vg/ProfileHeader";
import PerformanceMetricsPanel from "../../components/vg/PerformanceMetricPanel";
import ValidatorsPanel from "../../components/vg/ValidatorPanel";

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
        <div className="px-40 mt-10">
          <ProfileHeader VG={VG} />
          <PerformanceMetricsPanel VG={VG} />
          <ValidatorsPanel VG={VG} />
        </div>
      )}
    </>
  );
}

export default ValidatorGroupPage;
