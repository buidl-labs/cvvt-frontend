import { useCallback, useEffect, useState } from "react";
import { useContractKit } from "@celo-tools/use-contractkit";
import { ValidatorGroup } from "@celo/contractkit/lib/wrappers/Validators";

export default function useValidatorGroups() {
  const { kit } = useContractKit();
  const [validatorGroups, setValidatorGroups] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const getVGs = useCallback(async () => {
    const validators = await kit.contracts.getValidators();
    const registeredGroups: ValidatorGroup[] =
      await validators.getRegisteredValidatorGroups();
    return registeredGroups;
  }, []);

  useEffect(() => {
    getVGs().then((vgs) => {
      setValidatorGroups(vgs.map((vg) => vg.address));
      setLoading(false);
    });
  }, []);
  return { validatorGroups, loading };
}
