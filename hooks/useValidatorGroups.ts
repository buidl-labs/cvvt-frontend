import { useQuery } from "urql";
import gql from "graphql-tag";

const VG_Query = gql`
  query {
    ValidatorGroups {
      Address
      Name
      VerifiedDns
      TransparencyScore
      PerformanceScore
      EstimatedAPY
      RecievedVotes
      AvailableVotes
      GroupShare
      Validators {
        address
        name
        currently_elected
      }
    }
  }
`;

export default function useVG() {
  const [result, _] = useQuery({
    query: VG_Query,
  });
  return result;
}
