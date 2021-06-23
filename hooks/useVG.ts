import { useQuery } from "urql";
import gql from "graphql-tag";

const VG_Query = gql`
  query ($address: String!) {
    ValidatorGroup(address: $address) {
      Address
      Name
      TransparencyScore
      PerformanceScore
      EstimatedAPY
      RecievedVotes
      AvailableVotes
      EpochsServed
      LockedCelo
      SlashingPenaltyScore
      GroupScore
      GroupShare
      Validators {
        address
        name
        currently_elected
      }
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
