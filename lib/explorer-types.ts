export enum Order {
  ASC,
  DESC,
}

export type SortStatus = {
  key: string;
  order: Order;
};

export const FIELDS = [
  {
    name: "Group Name",
    key: "name",
  },
  {
    name: "Elected/Total Validators",
    key: "validators",
  },
  {
    name: "Recieved Votes",
    key: "recieved",
  },
  {
    name: "Available Votes",
    key: "available",
  },
  {
    name: "Attestation Score",
    key: "attestation",
  },
  {
    name: "Overall Score",
    key: "score",
  },
  {
    name: "Estimated APY",
    key: "apy",
  },
];
