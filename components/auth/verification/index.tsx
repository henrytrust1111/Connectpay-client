"use client";

import Image from "next/image";
import { Button } from "@/components/common-elements/button";
import { EAppRoutes } from "@/enums";
import { useRouter } from "next/navigation";

export function VerificationMessage() {
  return (
    <div className="">
      <div className="w-full flex flex-col items-center justify-center gap-10">
        <p className="text-[32px] font-bold text-center">
          Almost There! Verify Your Email
        </p>
        <Image src="/images/Frame.png" alt="frame" width={150} height={200} />
        <div className="flex flex-col items-center justify-center">
          <p className="text-[14px] text-secondary text-center">
            Your account has been created successfully A verification link has
            been sent to your email
          </p>
          <p className="text-[14px] text-secondary text-center">
            Please check your inbox or spam folder to complete your
            registration.
          </p>
        </div>
      </div>
    </div>
  );
}

export function EmailCheck() {
  return (
    <div className="pb-20">
      <div className="w-full flex flex-col items-center justify-center gap-10">
        <div className="flex flex-col items-center justify-center">
          <p className="text-[32px] font-bold">Check Your Email</p>
          <p className="text-[14px] text-secondary">
            Password reset link has been sent to
          </p>
          <p className="text-[14px] text-secondary">your email address</p>
        </div>
        <Image src="/images/Frame.png" alt="frame" width={150} height={200} />
        {/* <Button type="submit" className="w-[350px]">
          Open Email
        </Button> */}
      </div>
    </div>
  );
}

export function VerificationSuccess() {
  const router = useRouter();
  const handleNav = () => {
    router.push(EAppRoutes.LOGIN);
  }
  return (
    <div className="pb-20">
      <div className="w-full flex flex-col items-center justify-center gap-10">
        <div className="flex flex-col items-center justify-center">
          <p className="text-[32px] font-bold">Email Verified Successfully</p>
          <p className="text-[14px] text-secondary">
            Your email has been verified. You can now log in to
          </p>
          <p className="text-[14px] text-secondary">your account</p>
        </div>
        <Image
          src="/images/Frame (1).png"
          alt="frame"
          width={150}
          height={200}
        />
        <Button onClick={handleNav} type="submit" className="w-[350px]">
          Go to Login
        </Button>
      </div>
    </div>
  );
}
export function VerificationFailed() {
  const router = useRouter();
  const handleNav = () => {
    router.push(EAppRoutes.SIGNUP);
  };
  return (
    <div className="pb-20">
      <div className="w-full flex flex-col items-center justify-center gap-10">
        <div className="flex flex-col items-center justify-center">
          <p className="text-[32px] font-bold">
            Verification Link Invalid or Expired
          </p>
          <p className="text-[14px] text-secondary">
            We’re sorry, but this verification link is invalid or has expired.
          </p>
          <p className="text-[14px] text-secondary">
            Please go back to the sign-up page to create your account again.
          </p>
        </div>
        <Image src="/" alt="frame" width={150} height={200} />
        <Button
          // type="submit"
          onClick={handleNav}
          className="w-[350px] h-[48px]"
        >
          Sign Up
        </Button>
      </div>
    </div>
  );
}
