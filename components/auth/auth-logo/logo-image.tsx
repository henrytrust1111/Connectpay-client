import Image from "next/image";
import React from "react";
import { tailwindCn } from "@/helpers";

type Props = {
  theme?: string;
  className?: string;
};
export const LogoImage = ({ theme, className }: Props) => {
  const darkModeImage = "/images/logo-image-light.png";
  const lightModeImage = "/images/EYE BY PROCTORME FULL 2.png";
  return (
    <>
      <Image
        src={lightModeImage}
        alt="App Logo light"
        data-mode={theme}
        width={100}
        height={39}
        className={tailwindCn(
          "absolute w-[100px] h-[39px] top-0 left-0 z-10",
          {
            "opacity-0": theme === "dark",
          },
          className
        )}
        priority
      />
      <Image
        src={darkModeImage}
        alt="App Logo dark"
        data-mode={theme}
        width={100}
        height={39}
        className={tailwindCn(
          "absolute w-[100px] h-[39px] top-0 left-0 z-10",
          {
            "opacity-0": theme !== "dark",
          },
          className
        )}
        priority
      />
    </>
  );
};
