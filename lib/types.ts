import { BigNumber } from "bignumber.js";

export type VGSuggestion = {
  Address: string;
  Name: string;
  GroupScore: number;
  TransparencyScore: number;
  PerformanceScore: number;
  EstimatedAPY: number;
};

export type GroupVoting = {
  name: string;
  vg: string;
  active: BigNumber;
  pending: BigNumber;
};

export type ProcessedWithdrawals = {
  value: BigNumber;
  time: Date;
  status: WithdrawalStatus;
};

export enum WithdrawalStatus {
  PENDING = "Pending",
  AVAILABLE = "Available",
}

export interface ValidatorGroup {
  Address: string;
  Name: string;
  Email: string;
  WebsiteUrl: string;
  DiscordTag: string;
  TwitterUsername: string;
  GeographicLocation: string;
  VerifiedDns: boolean;
  TransparencyScore: number;
  PerformanceScore: number;
  EstimatedAPY: number;
  RecievedVotes: number;
  AvailableVotes: number;
  EpochsServed: number;
  LockedCelo: number;
  SlashingPenaltyScore: number;
  GroupScore: number;
  GroupShare: number;
  Validators: Validator[];
}

export interface Validator {
  address: string;
  name: string;
  currently_elected: boolean;
}
