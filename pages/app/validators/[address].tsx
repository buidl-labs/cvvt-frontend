import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import useVG from "../../../hooks/useVG";
import { ValidatorGroup } from "../../../lib/types";
import ProfileHeader from "../../../components/vg/ProfileHeader";
import PerformanceMetricsPanel from "../../../components/vg/PerformanceMetricPanel";
import ValidatorsPanel from "../../../components/vg/ValidatorPanel";
import Layout from "../../../components/app/layout";

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
    <Layout>
      <>
        {VG && (
          <div>
            <ProfileHeader VG={VG} />
            <PerformanceMetricsPanel VG={VG} />
            <ValidatorsPanel VG={VG} />
          </div>
        )}
      </>
    </Layout>
  );
}

export default ValidatorGroupPage;
