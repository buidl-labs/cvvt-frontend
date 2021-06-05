import StatCard from "./stat-card";

export default function StatGrid() {
  return (
    <ul className="mt-10 grid gap-10 grid-cols-4">
      <StatCard label="Total CELO" labelColor="text-gray-dark" value={500} />
      <StatCard label="Unlocked CELO" labelColor="text-primary" value={500} />
      <StatCard label="Locked CELO" labelColor="text-secondary" value={500} />
      <StatCard label="Voting CELO" labelColor="text-accent-dark" value={50} />
    </ul>
  );
}
