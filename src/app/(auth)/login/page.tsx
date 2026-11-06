"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Login failed.");
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#151226] px-4 py-8 sm:px-8 lg:px-12">

      {/* Main background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#5145ef] via-[#7950d9] to-[#dd6daf]" />

      {/* Background glow */}
      <div className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-[#9283ff]/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-0 h-96 w-96 rounded-full bg-pink-400/30 blur-3xl" />

      {/* Login card */}
      <div className="relative z-10 grid w-full max-w-[1100px] overflow-hidden rounded-2xl bg-white shadow-[0_30px_90px_rgba(31,18,83,0.28)] lg:min-h-[610px] lg:grid-cols-2">

        {/* LEFT PANEL */}
        <section className="relative flex min-h-[270px] flex-col justify-between overflow-hidden bg-gradient-to-br from-[#7063ef] via-[#a561d6] to-[#f17898] p-8 text-white sm:p-10 lg:min-h-[610px] lg:p-12">

          {/* Decorative overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-orange-300/10" />

          {/* Brand */}
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/30 bg-white/20 text-xl font-extrabold backdrop-blur-sm">
                K
              </div>

              <div>
                <h2 className="text-xl font-extrabold tracking-wide">
                  KINVEST
                </h2>

                <p className="text-xs font-medium tracking-widest text-white/80">
                  FLEET MANAGEMENT
                </p>
              </div>
            </div>
          </div>

          {/* Welcome text */}
          <div className="relative z-10 mt-10 max-w-md lg:mt-0">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-2 text-xs font-semibold backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-green-300" />
              SMART FLEET MANAGEMENT
            </div>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Welcome to
              <br />
              <span className="text-white">
                Kinvest Fleet
              </span>
            </h1>

            <p className="mt-5 max-w-sm text-sm leading-7 text-white/90 sm:text-base">
              Manage company vehicles, bookings, trips,
              maintenance and digital logbooks from one
              secure and organized platform.
            </p>
          </div>

          {/* Decorative shapes */}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 overflow-hidden lg:h-56">
            <div className="absolute -bottom-16 left-[-35px] h-48 w-16 rotate-45 rounded-full bg-gradient-to-b from-[#fa91ac] to-[#ffad66] opacity-85" />
            <div className="absolute -bottom-12 left-20 h-52 w-8 rotate-45 rounded-full bg-gradient-to-b from-[#ffb166] to-[#fd779f] opacity-90" />
            <div className="absolute -bottom-16 left-44 h-44 w-20 rotate-45 rounded-full bg-gradient-to-b from-[#f47dba] to-[#ffb45f] opacity-90" />
            <div className="absolute -bottom-14 right-20 h-48 w-14 rotate-45 rounded-full bg-gradient-to-b from-[#ff9c66] to-[#ef67b6] opacity-90" />
            <div className="absolute -bottom-20 right-[-25px] h-44 w-5 rotate-45 rounded-full bg-[#ffbc77]/80" />

            <div className="absolute bottom-20 left-16 h-1 w-20 -rotate-45 rounded-full bg-orange-300" />
            <div className="absolute bottom-28 right-24 h-1 w-16 -rotate-45 rounded-full bg-orange-300" />
          </div>

          {/* Footer */}
          <div className="relative z-10 mt-16 hidden text-xs text-white/75 lg:block">
            © Kinvest. All rights reserved.
          </div>
        </section>

        {/* RIGHT PANEL */}
        <section className="flex items-center justify-center bg-white px-7 py-12 sm:px-12 lg:px-16">

          <div className="w-full max-w-[350px]">

            <div className="mb-9 text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f0eaff] text-[#7654de]">
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="4" y="10" width="16" height="11" rx="2" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                  <circle cx="12" cy="15" r="1" />
                </svg>
              </div>

              <h2 className="text-2xl font-extrabold tracking-wide text-[#7152d8]">
                USER LOGIN
              </h2>

              <p className="mt-3 text-sm text-slate-500">
                Sign in to your Kinvest account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {error}
                </div>
              )}

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email address
                </label>

                <div className="relative">
                  <svg
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9f8ee9]"
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                  </svg>

                  <input
                    id="email"
                    type="email"
                    required
                    maxLength={255}
                    autoComplete="username"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Enter your email"
                    className="h-13 w-full rounded-xl border border-[#e7e0fb] bg-[#f3efff] py-3 pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-[#a29aba] focus:border-[#8664e5] focus:ring-2 focus:ring-[#8664e5]/15"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

                <div className="relative">
                  <svg
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9f8ee9]"
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="5" y="10" width="14" height="11" rx="2" />
                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                  </svg>

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    className="h-13 w-full rounded-xl border border-[#e7e0fb] bg-[#f3efff] py-3 pl-12 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-[#a29aba] focus:border-[#8664e5] focus:ring-2 focus:ring-[#8664e5]/15"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#8268d3] hover:text-[#6147bd]"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Forgot password */}
              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-[#8767de] transition hover:text-[#6245bd] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Login button */}
              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center rounded-full bg-gradient-to-r from-[#dd63b8] to-[#8260e8] text-sm font-bold tracking-wide text-white shadow-lg shadow-purple-200 transition hover:from-[#cc50a6] hover:to-[#704de0] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "SIGNING IN..." : "LOGIN"}
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-xs text-slate-400">
                Secure access for authorized Kinvest employees
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
