"use client";

import Image from "next/image";
import { Button } from "@/components/common-elements/button";
import { useSession } from "@/hooks";

export default function ResetEmailAlertPage() {
  const { logout } = useSession();

  const handleNav = () => {
    logout();
  };

  return (
    <div className="pb-20">
      <div className="w-full flex flex-col items-center justify-center gap-10">
        <div className="flex flex-col items-center justify-center gap-1">
          <p className="text-[32px] font-bold text-center">Check Your Email</p>
          <p className="text-[14px] text-secondary text-center">
            We have sent a verification link to confirm your new email Please
            check your spam or junk mail if you cant find it in your inbox
          </p>
        </div>
        <Image src="/images/Frame.png" alt="" width={150} height={200} />
        <Button onClick={handleNav} type="submit" className="w-[350px]">
          Back to Login
        </Button>
      </div>
    </div>
  );
}
