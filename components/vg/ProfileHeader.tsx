import { ValidatorGroup } from "../../lib/types";
import LinkIcon from "../icons/link";
import LocationIcon from "../icons/location";
import MailIcon from "../icons/mail";
import TwitterIcon from "../icons/twitter";
import DiscordIcon from "../icons/discord";
import CopyIcon from "../icons/copy";

export default function ProfileHeader({ VG }: { VG: ValidatorGroup }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-medium">
          {VG.Name ? VG.Name : "Unknown Group"}
        </h3>
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
          <CopyIcon />
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
