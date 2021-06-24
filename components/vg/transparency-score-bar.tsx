export default function TransparencyScoreBar({ score }: { score: number }) {
  return (
    <div className="space-y-5 mt-6">
      <p className="text-gray-dark">
        Complete your profile to increase your Transparency Score:{" "}
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
