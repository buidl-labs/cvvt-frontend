import Bag from "./illustrations/bag";
import Heart from "./illustrations/heart";
import Announcement from "./illustrations/announcement";
export default function FeatureGrid() {
  const features = [
    {
      asset: <Heart />,
      heading: "Gain Voter’s Trust",
      subtext:
        "Aggregate more votes from Voters by mitigating information disparity between Voters & Validators.",
    },
    {
      asset: <Bag />,
      heading: "Earn More Epoch Rewards",
      subtext:
        "Gain more votes & ensure more of your associated Validators get elected resulting in greater Epoch Rewards.",
    },
    {
      asset: <Announcement />,
      heading: "Attract Efficient Validators",
      subtext:
        "Market your proficiency & policies to attract individual Validators in the network to join your Validator Group.",
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
      <p className="mt-5 text-gray">{subtext}</p>
    </div>
  );
}
