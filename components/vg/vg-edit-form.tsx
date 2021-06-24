import React from "react";
import { ValidatorGroup } from "../../lib/types";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useVGMutation from "../../hooks/useVGMutation";

type FormType = {
  email: string;
  geoURL: string;
  twitter: string;
  discord: string;
};
const FormSchema = yup.object().shape({
  email: yup.string().email(),
  geoLocation: yup.string().url(),
  twitter: yup.string(),
  discord: yup.string(),
});
export default function VGEditForm({
  VG,
  setVG,
}: {
  VG: ValidatorGroup;
  setVG: React.Dispatch<React.SetStateAction<ValidatorGroup | undefined>>;
}) {
  const { updateVG, updateVGResult } = useVGMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormType>({
    resolver: yupResolver(FormSchema),
    defaultValues: {
      email: VG.Email,
      geoURL: VG.GeographicLocation,
      discord: VG.DiscordTag,
      twitter: VG.TwitterUsername,
    },
  });

  const onFormSubmit = (data: FormType) => {
    const formData = Object.fromEntries(
      Object.entries(data).filter((entry) => entry[1].length > 0)
    );

    const variables = { id: VG.ID, ...formData };
    console.log(variables);
    updateVG(variables).then(async (res) => {
      if (res.error) {
        console.log(res.error);
        return;
      }
      const vgData = res.data.UpdateVGSocialInfo;
      console.log(vgData);
      setVG({
        ...VG,
        DiscordTag: vgData.DiscordTag,
        Email: vgData.Email,
        TwitterUsername: vgData.TwitterUsername,
        GeographicLocation: vgData.GeographicLocation,
      });
      console.log("VG UPDATED");
    });
  };

  return (
    <div className="mt-10  border border-gray-light rounded-md p-10 text-gray-dark">
      <h3 className="text-xl font-medium">Edit Your Profile</h3>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <div className="grid grid-cols-2 mt-5 gap-x-10 gap-y-3">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-dark"
            >
              Your email
            </label>
            <div className="mt-2">
              <input
                {...register("email")}
                type="email"
                id="email"
                className={`${
                  errors?.email
                    ? "border-alert bg-alert-light-light"
                    : "border-gray bg-gray-light-light"
                } border-2  rounded-md shadow-sm text-lg block w-full`}
                placeholder="eg. something@gmail.com"
              />
            </div>
            <p className="mt-1 text-sm h-6 w-full text-alert">
              {errors?.email ? errors.email.message : ""}
            </p>
          </div>
          <div>
            <label
              htmlFor="geoLocation"
              className="block text-sm font-medium text-gray-dark"
            >
              Your Location
            </label>
            <div className="mt-2">
              <input
                {...register("geoURL")}
                type="text"
                id="geoLocation"
                className={`${
                  errors?.geoURL
                    ? "border-alert bg-alert-light-light"
                    : "border-gray bg-gray-light-light"
                } border-2  rounded-md shadow-sm text-lg block w-full`}
                placeholder="Google Map URL of your City"
              />
            </div>
            <p className="mt-1 text-sm h-6 w-full text-alert">
              {errors?.geoURL && errors.geoURL.message}
            </p>
          </div>
          <div>
            <label
              htmlFor="twitter"
              className="block text-sm font-medium text-gray-dark"
            >
              Twitter Handle
            </label>
            <div className="mt-2">
              <input
                {...register("twitter")}
                type="text"
                id="twitter"
                className={`${
                  errors?.twitter
                    ? "border-alert bg-alert-light-light"
                    : "border-gray bg-gray-light-light"
                } border-2  rounded-md shadow-sm text-lg block w-full`}
                placeholder="eg. @CeloOrg"
              />
            </div>
            <p className="mt-1 text-sm h-6 w-full text-alert">
              {errors?.twitter && errors.twitter.message}
            </p>
          </div>
          <div>
            <label
              htmlFor="discord"
              className="block text-sm font-medium text-gray-dark"
            >
              Discord tag
            </label>
            <div className="mt-2">
              <input
                {...register("discord")}
                type="text"
                id="discord"
                className={`${
                  errors?.discord
                    ? "border-alert bg-alert-light-light"
                    : "border-gray bg-gray-light-light"
                } border-2  rounded-md shadow-sm text-lg block w-full`}
                placeholder="eg. manan#1170"
              />
            </div>
            <p className="mt-1 text-sm h-6 w-full text-alert">
              {errors?.discord && errors.discord.message}
            </p>
          </div>
        </div>
        <button className="mt-4 bg-primary py-3 px-12 rounded-md text-white text-lg font-medium shadow-sm">
          Save
        </button>
      </form>
    </div>
  );
}

// function Input({
//   label,
//   type,
//   name,
//   placeholder,
//   register,
// }: {
//   label: string;
//   type: string;
//   name: string;
//   placeholder: string;
//   register: UseFormRegister<FormType>;
// }) {
//   const possibleNames = ["email", "geoLocation", "twitter", "discord"];
//   if (!possibleNames.includes(name)) return;
//   return (
//     <div>
//       <label
//         htmlFor={name}
//         className="block text-sm font-medium text-gray-dark"
//       >
//         {label}
//       </label>
//       <div className="mt-2">
//         <input
//           {...register(name)}
//           type={type}
//           id={name}
//           className="border-2 border-gray bg-gray-light-light rounded-md shadow-sm text-lg block w-full"
//           placeholder={placeholder}
//         />
//       </div>
//     </div>
//   );
// }
