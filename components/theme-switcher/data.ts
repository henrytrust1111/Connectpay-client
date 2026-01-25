import { TMode } from "./types";

export const modeOptions = [
  { label: "Light Mode", value: "light" },
  { label: "Dark Mode", value: "dark" },
];

export const getModeLabel = (mode: TMode) => {
  const option = modeOptions.find((opt) => opt.value === mode);
  return option ? option.label : "Light Mode";
};
