import React from "react";
import { ValidatorGroup } from "../../lib/types";

export default function VGEditForm({ VG }: { VG: ValidatorGroup }) {
  return (
    <div className="mt-10  border border-gray-light rounded-md p-10 text-gray-dark">
      <h3 className="text-xl  font-medium">Edit Your Profile</h3>
      <div className="grid grid-cols-2 mt-5 gap-x-10 gap-y-5">
        <Input
          label="Email Address"
          type="email"
          name="email"
          placeholder={VG.Email ? VG.Email : "eg. sample@email.com"}
        />
        <Input
          label="Geographic Location"
          type="text"
          name="geoLocation"
          placeholder={
            VG.GeographicLocation
              ? VG.GeographicLocation
              : "Google Map URL of your city"
          }
        />
        <Input
          label="Your Twitter Handle"
          type="text"
          name="twitter"
          placeholder={VG.TwitterUsername ? VG.TwitterUsername : "eg. @celoorg"}
        />
        <Input
          label="Your Discord Tag"
          type="text"
          name="discord"
          placeholder={VG.DiscordTag ? VG.DiscordTag : "eg. manan#1170"}
        />
      </div>
      <button className="mt-10 bg-primary py-3 px-12 rounded-md text-white text-lg font-medium shadow-sm">
        Save
      </button>
    </div>
  );
}

function Input({
  label,
  type,
  name,
  placeholder,
}: {
  label: string;
  type: string;
  name: string;
  placeholder: string;
}) {
  return (
    <div>
      <label
        htmlFor={label}
        className="block text-sm font-medium text-gray-dark"
      >
        {label}
      </label>
      <div className="mt-2">
        <input
          type={type}
          name={name}
          id={label}
          className="border-2 border-gray bg-gray-light-light rounded-md shadow-sm text-lg block w-full"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
