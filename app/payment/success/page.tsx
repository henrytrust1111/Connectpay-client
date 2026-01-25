"use client";

import Image from "next/image";
import { Button } from "@/components/common-elements/button";
import { EAppRoutes } from "@/enums";
import { useRouter } from "next/navigation";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const handleNav = () => {
    router.push(EAppRoutes.DASHBOARD);
  };
  return (
    <div className="pb-20">
      <div className="w-full flex flex-col items-center justify-center gap-10">
        <div className="flex flex-col items-center justify-center">
          <p className="text-[32px] font-bold">Payment Confirmed</p>
          <p className="text-[14px] text-secondary text-center">
            Your payment has been processed successfully. Your wallet balance has been updated, and a confirmation email has
            been sent to your inbox
          </p>
        </div>
        <Image
          src="/images/Frame (1).png"
          alt="frame"
          width={150}
          height={200}
        />
        <Button onClick={handleNav} type="submit" className="w-[350px]">
          Return to Billing Dashboard
        </Button>
      </div>
    </div>
  );
}
