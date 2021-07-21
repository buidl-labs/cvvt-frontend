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
        <div className="flex items-center space-x-2">
          <h3 className="text-2xl font-medium text-gray-dark">
            {VG.Name ? VG.Name : "Unkown Group"}
          </h3>
          {VG.VerifiedDns && (
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0)">
                <path
                  d="M22 11L19.5095 8.23485L19.8994 4.53309L16.2577 3.7621L14.4 0.535034L11 2.05455L7.60001 0.535034L5.74235 3.7621L2.1006 4.53309L2.4905 8.23485L0 11L2.49046 13.7651L2.10056 17.4668L5.74231 18.2378L7.59997 21.4649L11 19.9453L14.4 21.4649L16.2577 18.2378L19.8994 17.4668L19.5095 13.7651L22 11ZM15.6115 8.59141L10.0899 14.7775L6.25301 10.9406L7.16562 10.028L10.0366 12.899L14.6486 7.73198L15.6115 8.59141Z"
                  fill="#FBCC5C"
                />
              </g>
              <defs>
                <clipPath id="clip0">
                  <rect width="22" height="22" fill="white" />
                </clipPath>
              </defs>
            </svg>
          )}
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
