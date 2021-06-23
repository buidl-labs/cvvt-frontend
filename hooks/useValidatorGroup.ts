import { useQuery } from "urql";
import gql from "graphql-tag";

const VG_Query = gql`
  query ($sort_by_score: Boolean, $limit: Int) {
    ValidatorGroups(sort_by_score: $sort_by_score, limit: $limit) {
      Address
      Name
      GroupScore
      TransparencyScore
      PerformanceScore
      EstimatedAPY
    }
  }
`;

export default function useValidatorGroups(sort?: boolean, limit?: number) {
  const [result, _] = useQuery({
    query: VG_Query,
    variables: { sort_by_score: sort, limit: limit },
  });
  return result;
}
