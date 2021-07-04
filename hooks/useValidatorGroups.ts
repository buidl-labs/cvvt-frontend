import { useQuery } from "urql";
import gql from "graphql-tag";

const VG_Query = gql`
  query ($sort_by_score: Boolean) {
    ValidatorGroups(sort_by_score: $sort_by_score) {
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

export default function useVG(sort?: boolean) {
  const [result, _] = useQuery({
    query: VG_Query,
    variables: { sort_by_score: sort },
  });
  return result;
}
