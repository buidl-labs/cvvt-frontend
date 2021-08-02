import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const fetchIdaddWalletIfDoesntExist = async (
  address: string
): Promise<number> => {
  let { data: wallets, error } = await supabase
    .from("wallets")
    .select("id")
    .eq("address", address);

  if (!error) {
    if (wallets.length == 0) {
      const { data, error } = await supabase
        .from("wallets")
        .insert([{ address }]);
      if (!error) {
        return data[0].id;
      }
    } else {
      return wallets[0].id;
    }
  }
  return -1;
};

export const fetchIdAddVGIfDoesntExist = async (
  address: string
): Promise<number> => {
  let { data: groups, error } = await supabase
    .from("validator_groups")
    .select("id")
    .eq("address", address);

  if (!error) {
    if (groups.length == 0) {
      const { data, error } = await supabase
        .from("validator_groups")
        .insert([{ address }]);
      if (!error) {
        return data[0].id;
      }
    } else {
      return groups[0].id;
    }
  }
  return -1;
};

export const trackCELOLockedOrUnlockedOrWithdraw = async (
  amount: number,
  address: string,
  action: string
): Promise<boolean> => {
  const wallet_id = await fetchIdaddWalletIfDoesntExist(address);
  if (wallet_id == -1) {
    return false;
  }
  const { error } = await supabase
    .from("actions")
    .insert([{ wallet_id, amount, action }]);
  if (error) return false;
  return true;
};

export const trackVoteOrRevoke = async (
  amount: number,
  address: string,
  vg: string,
  action: string
): Promise<boolean> => {
  const wallet_id = await fetchIdaddWalletIfDoesntExist(address);
  if (wallet_id == -1) {
    return false;
  }
  const group_id = await fetchIdAddVGIfDoesntExist(vg);
  if (group_id == -1) {
    return false;
  }
  const { error } = await supabase
    .from("actions")
    .insert([{ wallet_id, group_id, amount, action }]);
  if (error) return false;
  return true;
};
