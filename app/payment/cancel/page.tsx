"use client";

import Image from "next/image";
import { Button } from "@/components/common-elements/button";
import { EAppRoutes } from "@/enums";
import { useRouter } from "next/navigation";

export default function PaymentCancelPage() {
  const router = useRouter();
  const handleNav = () => {
    router.push(EAppRoutes.DASHBOARD);
  };
  return (
    <div className="pb-20">
      <div className="w-full flex flex-col items-center justify-center gap-10">
        <div className="flex flex-col items-center justify-center">
          <p className="text-[32px] font-bold text-center w-max">
            We couldn&apos;t complete your payment.
          </p>
          <p className="text-[14px] text-secondary text-center">
            Your payment was not successful due to an issue with the
            transaction. No charges was made to your account. Please try again.
          </p>
        </div>
        <Image src="/images/Group.png" alt="Cancel" width={150} height={200} />
        <Button onClick={handleNav} type="submit" className="w-[350px]">
          Try Payment Again
        </Button>
      </div>
    </div>
  );
}
