"use client";

import Image from "next/image";
import { Button } from "@/components/common-elements/button";
import { EAppRoutes } from "@/enums";
import { useRouter } from "next/navigation";

export default function ResetEmailSuccessPage() {
  const router = useRouter();
  const handleNav = () => {
    router.push(EAppRoutes.LOGIN);
  };
  return (
    <div className="pb-20">
      <div className="w-full flex flex-col items-center justify-center gap-10">
        <div className="flex flex-col items-center justify-center gap-1">
          <p className="text-[32px] font-bold text-center">
            Email Updated Successfully
          </p>
          <p className="text-[14px] text-secondary text-center">
            Your email has been updated. You can now log in with your new email
          </p>
        </div>
        <Image
          src="/images/Frame (1).png"
          alt="frame"
          width={150}
          height={200}
        />
        <Button onClick={handleNav} type="submit" className="w-[350px]">
          Login
        </Button>
      </div>
    </div>
  );
}
