"use client";

import {
  useState,
  type FormEvent,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  UserPlus,
  UserRound,
  Mail,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import { useDashboardUser } from "@/components/layout/DashboardShell";

type Role =
  | "employee"
  | "fleet_admin"
  | "management"
  | "system_admin";

type ApiError = {
  message?: string;
  errors?: Record<string, string[]>;
};

export default function RegisterEmployeePage() {
  const router = useRouter();
  const currentUser = useDashboardUser();

  const isSystemAdmin =
    currentUser.roles.includes("system_admin");

  const canRegister =
    currentUser.permissions.includes("users.create") ||
    isSystemAdmin;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [role, setRole] = useState<Role>("employee");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string[]>
  >({});

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (loading || !canRegister) return;

    setError("");
    setFieldErrors({});

    if (password !== confirmation) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 12) {
      setError(
        "Password must contain at least 12 characters."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/backend/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "same-origin",
          body: JSON.stringify({
            name,
            email,
            password,
            password_confirmation: confirmation,
            role: isSystemAdmin ? role : "employee",
          }),
        }
      );

      const result = (await response.json()) as ApiError;

      if (!response.ok) {
        setError(
          result.message ||
          "Unable to register employee."
        );
        setFieldErrors(result.errors || {});
        return;
      }

      router.push("/dashboard/users");
      router.refresh();
    } catch {
      setError(
        "Connection failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const fields = [
    {
      id: "name",
      label: "Full Name",
      icon: UserRound,
      type: "text",
      value: name,
      change: setName,
      placeholder: "Employee full name",
    },
    {
      id: "email",
      label: "Email Address",
      icon: Mail,
      type: "email",
      value: email,
      change: setEmail,
      placeholder: "employee@company.com",
    },
    {
      id: "password",
      label: "Password",
      icon: LockKeyhole,
      type: "password",
      value: password,
      change: setPassword,
      placeholder: "Minimum 12 characters",
    },
    {
      id: "password_confirmation",
      label: "Confirm Password",
      icon: LockKeyhole,
      type: "password",
      value: confirmation,
      change: setConfirmation,
      placeholder: "Repeat password",
    },
  ];

  return (
    <main className="mx-auto max-w-6xl p-5 md:p-8">
      <Link
        href="/dashboard/users"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
      >
        <ArrowLeft size={18} />
        Back to Employees
      </Link>

      <div className="mb-7">
        <p className="text-xs font-bold uppercase tracking-widest text-indigo-500">
          Module 1 / User Management
        </p>

        <h1 className="mt-2 text-2xl font-bold text-slate-800">
          Register Employee
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Create a new account for an authorized Kinvest
          employee.
        </p>
      </div>

      {!canRegister ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">
          You do not have permission to register employees.
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-7 flex items-center gap-3 border-b border-slate-100 pb-5">
              <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                <UserPlus size={23} />
              </div>

              <div>
                <h2 className="font-bold text-slate-800">
                  Employee Information
                </h2>
                <p className="text-xs text-slate-400">
                  Enter the details below
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                >
                  {error}
                </div>
              )}

              {fields.map((field) => {
                const Icon = field.icon;

                return (
                  <div key={field.id}>
                    <label
                      htmlFor={field.id}
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      {field.label}
                    </label>

                    <div className="relative">
                      <Icon
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        id={field.id}
                        type={field.type}
                        required
                        autoComplete="off"
                        maxLength={
                          field.type === "password"
                            ? 1024
                            : 255
                        }
                        minLength={
                          field.type === "password"
                            ? 12
                            : undefined
                        }
                        value={field.value}
                        onChange={(event) =>
                          field.change(event.target.value)
                        }
                        placeholder={field.placeholder}
                        className="w-full rounded-xl border border-slate-200 py-3 pl-12 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      />
                    </div>

                    {fieldErrors[field.id]?.map((message) => (
                      <p
                        key={message}
                        className="mt-1 text-xs text-red-600"
                      >
                        {message}
                      </p>
                    ))}
                  </div>
                );
              })}

              {isSystemAdmin && (
                <div>
                  <label
                    htmlFor="role"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Employee Role
                  </label>

                  <select
                    id="role"
                    value={role}
                    onChange={(event) =>
                      setRole(event.target.value as Role)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500"
                  >
                    <option value="employee">Employee</option>
                    <option value="fleet_admin">Fleet Administrator</option>
                    <option value="management">Management</option>
                    <option value="system_admin">System Administrator</option>
                  </select>
                </div>
              )}

              <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading
                    ? "Registering..."
                    : "Register Employee"}
                </button>

                <Link
                  href="/dashboard/users"
                  className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </section>

          <aside className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <ShieldCheck size={22} />
              </div>

              <h3 className="font-bold text-slate-800">
                Account Security
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Every new account is protected by Laravel
                authentication and role-based permissions.
              </p>
            </div>

            <div className="rounded-2xl bg-indigo-50 p-6">
              <h3 className="font-bold text-indigo-900">
                Administrator Guidance
              </h3>

              <p className="mt-3 text-sm leading-6 text-indigo-700">
                Assign only the permissions an employee
                needs. Share initial credentials securely
                and require the employee to change their
                password after their first login.
              </p>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}
