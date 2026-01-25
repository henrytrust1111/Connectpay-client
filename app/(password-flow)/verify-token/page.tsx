"use client"

import { VerificationSuccess, VerificationFailed } from "@/components/auth/verification";
// import {  } from "@/api/auth";
import { verifySignUpToken } from "@/services/auth";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Loader2 } from "lucide-react";


export function VerificationContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'failed'>('loading');

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setVerificationStatus('failed');
        return;
      }

      try {
        const response = await verifySignUpToken(token);
        if (response.success) {
          setVerificationStatus('success');
        } else {
          setVerificationStatus('failed');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setVerificationStatus('failed');
      }
    };

    verifyToken();
  }, [token]);

  if (verificationStatus === 'loading') {
    return <div>Verifying your email...</div>;
  }

  return verificationStatus === 'success' ? <VerificationSuccess /> : <VerificationFailed />;
}

export default function Verification() {
  return (
    <Suspense 
      fallback={
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="animate-spin" size={24} />
          <span className="ml-2">Loading...</span>
        </div>
      }
    >
      <VerificationContent />
    </Suspense>
  );
}