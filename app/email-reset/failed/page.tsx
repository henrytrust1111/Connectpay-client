"use client";

import Image from "next/image";
import { Button } from "@/components/common-elements/button";
import { EAppRoutes } from "@/enums";
import { useRouter } from "next/navigation";

export default function ResetEmailFailedPage() {
  const router = useRouter();
  const handleNav = () => {
    router.push(EAppRoutes.LOGIN);
  };
  return (
    <div className="pb-20">
      <div className="w-full flex flex-col items-center justify-center gap-10">
        <div className="flex flex-col items-center justify-center gap-1">
          <p className="text-[32px] font-bold w-max text-center">
            {" "}
            We could not complete the request
          </p>
          <p className="text-[14px] text-secondary text-center">
            We&apos;re sorry, but we could not complete the email change Please
            login with your old email and try again.
          </p>
        </div>
        <Image src="/images/Group.png" alt="frame" width={150} height={200} />
        <Button onClick={handleNav} type="submit" className="w-[350px]">
          Login
        </Button>
      </div>
    </div>
  );
}
