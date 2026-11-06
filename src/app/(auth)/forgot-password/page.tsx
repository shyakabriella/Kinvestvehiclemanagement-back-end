"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  Mail,
  ShieldCheck,
} from "lucide-react";

type ApiResponse = {
  message?: string;
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        "/api/auth/forgot-password",
        {
          method: "POST",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
          }),
        }
      );

      const result =
        (await response.json()) as ApiResponse;

      if (!response.ok) {
        setError(
          result.message ||
          "Unable to request password recovery."
        );
        return;
      }

      setMessage(
        result.message ||
        "If this account exists, reset instructions will be sent."
      );
      setSubmitted(true);
    } catch {
      setError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#f5f7fc] px-4 py-8 sm:px-6">
      <div className="w-full max-w-md">
        <div className="mb-7 flex items-center justify-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-xl font-extrabold text-white shadow-lg shadow-indigo-200">
            K
          </div>

          <div>
            <p className="text-lg font-extrabold tracking-wide text-indigo-600">
              KINVEST
            </p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Fleet Management
            </p>
          </div>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/50 sm:p-8">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            {submitted ? (
              <CheckCircle2 size={27} />
            ) : (
              <KeyRound size={27} />
            )}
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            {submitted
              ? "Check your email"
              : "Forgot your password?"}
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            {submitted
              ? "If your account is eligible for recovery, you will receive password reset instructions."
              : "Enter the email address linked to your Kinvest account."}
          </p>

          {submitted ? (
            <div className="mt-6 space-y-5">
              <p
                role="status"
                className="break-words rounded-xl border border-green-100 bg-green-50 p-4 text-sm leading-6 text-green-800"
              >
                {message}
              </p>

              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setEmail("");
                  setError("");
                  setMessage("");
                }}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Try another email
              </button>
            </div>
          ) : (
            <form
              onSubmit={submit}
              className="mt-7 space-y-5"
            >
              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                >
                  {error}
                </div>
              )}

              <div>
                <label
                  htmlFor="recovery-email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="recovery-email"
                    type="email"
                    required
                    maxLength={255}
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    placeholder="name@company.com"
                    className="w-full min-w-0 rounded-xl border border-slate-200 py-3.5 pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Submitting..."
                  : "Send Reset Instructions"}

                {!loading && <ArrowRight size={18} />}
              </button>
            </form>
          )}

          <Link
            href="/login"
            className="mt-7 flex items-center justify-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            <ArrowLeft size={17} />
            Back to Login
          </Link>
        </section>

        <div className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-slate-500">
          <ShieldCheck size={16} />
          Secure account recovery
        </div>
      </div>
    </main>
  );
}
