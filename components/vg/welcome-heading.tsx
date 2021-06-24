export default function WelcomeHeading({
  name,
  address,
}: {
  name: string;
  address: string;
}) {
  return (
    <h1 className="text-2xl text-gray-dark font-medium">
      Welcome, {name ? name : `${address.slice(0, 3)}...${address.slice(-5)}`}
    </h1>
  );
}
