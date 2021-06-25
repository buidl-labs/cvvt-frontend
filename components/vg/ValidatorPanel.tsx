import { Validator, ValidatorGroup } from "../../lib/types";

export default function ValidatorsPanel({ VG }: { VG: ValidatorGroup }) {
  return (
    <div className="mt-10 border border-gray-light rounded-md p-10 text-gray-dark">
      <div className="flex items-baseline justify-between">
        <h4 className="text-xl font-medium">Affiliated Validators</h4>
        <p className="font-medium">
          Group Share: {(VG.GroupShare * 100).toFixed(0)}%
        </p>
      </div>
      <div className="grid grid-cols-2 gap-5 mt-5">
        {VG.Validators.map((v) => (
          <ValidatorBlock validator={v} />
        ))}
      </div>
    </div>
  );
}

function ValidatorBlock({ validator }: { validator: Validator }) {
  return (
    <div className="border border-gray-light rounded-md px-5 py-3">
      <div className="flex items-baseline justify-between">
        <h5 className="font-medium">
          {validator.name ? validator.name : "Unknown Validator"}
        </h5>
        <p
          className={`${
            validator.currently_elected ? "text-gray-dark" : "text-gray"
          } flex items-center`}
        >
          <svg
            className={`h-4 w-4`}
            viewBox="0 0 32 32"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M31.9217 28.2182L25.8851 2.03636C25.53 0.872727 24.2102 0 23.5 0H8.5C7.61226 0 6.53233 0.872727 6.17724 2.03636L0.140599 28.2182C-0.392046 29.9636 0.673244 32 1.91608 32H29.9687C31.3891 32 32.2768 29.9636 31.9217 28.2182Z"
              fill="currentColor"
            />
          </svg>
          <span className="ml-3 mt-0.5">
            {validator.currently_elected ? "Elected" : "Refused"}
          </span>
        </p>
      </div>

      <p className="text-gray text-sm mt-2">{validator.address}</p>
    </div>
  );
}
