import { Suspense } from "react";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-dvh items-center justify-center bg-[#f5f7fc] p-5">
          <p className="text-sm text-slate-500">
            Loading password recovery...
          </p>
        </main>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
