import { useQuery } from "urql";
import gql from "graphql-tag";

const VG_Query = gql`
  query ($address: String!) {
    ValidatorGroup(address: $address) {
      Address
      Name
      GroupScore
      TransparencyScore
      PerformanceScore
      EstimatedAPY
    }
  }
`;

export default function useVG(address: string) {
  const [result, _] = useQuery({
    query: VG_Query,
    variables: { address },
  });
  return result;
}
