import { useQuery } from "urql";

const VG_Query = `
  query{
    ValidatorGroups {
      Name
      PerformanceScore
    }
  }
`;

export default function useValidatorGroups() {
  
  const [result, _] = useQuery({
    query: VG_Query,
  });
  return result;
}