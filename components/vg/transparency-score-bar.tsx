export default function TransparencyScoreBar({ score }: { score: number }) {
  console.log(score);
  return (
    <div className="space-y-5 mt-6">
      <p className="text-gray-dark">
        {score < 1
          ? "Complete your profile to increase your Transparency Score:"
          : "Congrats! You've completed your profile:"}{" "}
        <span className="ml-1 text-2xl font-medium">
          {(score * 100).toFixed(0)}/100%
        </span>
      </p>
      <div className="border border-white rounded-full h-4 flex overflow-hidden bg-primary-light-light">
        <div
          className="h-full bg-primary rounded-full"
          style={{ width: `${score * 100}%` }}
        ></div>
      </div>
    </div>
  );
}
