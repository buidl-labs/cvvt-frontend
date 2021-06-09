import {BigNumber} from "bignumber.js"
export type VGSuggestion = {
  Address: string
  Name: string
  GroupScore: number
  TransparencyScore: number
  PerformanceScore: number
  EstimatedAPY: number
}

export type GroupVoting = {
  name: string;
  vg: string;
  active: BigNumber;
  pending: BigNumber;
};