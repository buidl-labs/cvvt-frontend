import React, { useEffect, useState } from "react";
import useVG from "../../hooks/useVG";
import useStore from "../../store/vg-store";

export default function VGDash() {
  const [VG, setVG] = useState();
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
      <div>{user}</div>
      <pre className="mt-4">{JSON.stringify(VG, null, 2)}</pre>
    </>
  );
}
