import { ValidatorGroup } from "../../lib/types";
import LinkIcon from "../icons/link";
import LocationIcon from "../icons/location";
import MailIcon from "../icons/mail";
import TwitterIcon from "../icons/twitter";
import DiscordIcon from "../icons/discord";
import CopyIcon from "../icons/copy";
import ProfileBadge from "../icons/profile-claimed";

function hasProfile(VG) {
  console.log(VG);
  return (
    VG.Email !== "" ||
    VG.GeographicLocation !== "" ||
    VG.TwitterUsername !== "" ||
    VG.DiscordTag !== ""
  );
}

export default function ProfileHeader({ VG }: { VG: ValidatorGroup }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h3 className="text-2xl font-medium text-gray-dark">
            {VG.Name ? VG.Name : "Unkown Group"}
          </h3>
          {hasProfile(VG) && <ProfileBadge />}
        </div>
        <div className="text-lg text-gray">
          {VG.WebsiteUrl && (
            <a
              className="inline-flex items-center"
              href={`https://${VG.WebsiteUrl}`}
              target="_blank"
            >
              <LinkIcon />
              <span className="ml-2">{VG.WebsiteUrl}</span>
            </a>
          )}
          {VG.GeographicLocation && (
            <a
              className="inline-flex items-center ml-10"
              href={VG.GeographicLocation}
              target="_blank"
            >
              <LocationIcon />
              <span className="ml-2">VG Location</span>
            </a>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between text-gray text-lg mt-5">
        <p className="inline-flex items-center">
          <span className="mr-3">{VG.Address}</span>
          <button onClick={() => navigator.clipboard.writeText(VG.Address)}>
            <CopyIcon size="lg" />
          </button>
        </p>
        <div>
          {VG.Email && (
            <a
              className="inline-flex items-center ml-10"
              href={`mailto:${VG.Email}`}
              target="_blank"
            >
              <MailIcon />
              <span className="ml-2">{VG.Email}</span>
            </a>
          )}
          {VG.TwitterUsername && (
            <a
              className="inline-flex items-center ml-10"
              href={`https://twitter.com/${VG.TwitterUsername}`}
              target="_blank"
            >
              <TwitterIcon />
              <span className="ml-2">{VG.TwitterUsername}</span>
            </a>
          )}
          {VG.DiscordTag && (
            <p className="inline-flex items-center ml-10">
              <DiscordIcon />
              <span className="ml-2">{VG.DiscordTag}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
