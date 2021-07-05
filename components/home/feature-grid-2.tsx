import Map from "./illustrations/map";
import Bag from "./illustrations/bag";
import Document from "./illustrations/document";

export default function SecondFeatureGrid() {
  const features = [
    {
      asset: <Map />,
      heading: "Shape Direction of Celo",
      subtext: "Select Validator Groups that operate a well-run Organization.",
    },
    {
      asset: <Bag />,
      heading: "Earn Voter-Rewards",
      subtext: "Put your CELOs to work and earn Voter-Rewards.",
    },
    {
      asset: <Document />,
      heading: "Promote Efficient Validators",
      subtext: "Vote for efficient & reliable Validator Groups on the Network.",
    },
  ];
  return (
    <div className="grid grid-cols-3 gap-x-20 mt-16 px-56">
      {features.map((f) => (
        <FeatureItem asset={f.asset} heading={f.heading} subtext={f.subtext} />
      ))}
    </div>
  );
}

function FeatureItem({
  asset,
  heading,
  subtext,
}: {
  asset: JSX.Element;
  heading: string;
  subtext: string;
}) {
  return (
    <div className="flex flex-col items-center">
      {asset}
      <h4 className="mt-10 text-xl font-medium">{heading}</h4>
      <p className="mt-5 text-gray max-w-xs">{subtext}</p>
    </div>
  );
}
