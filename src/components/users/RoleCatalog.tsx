"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  ShieldCheck,
  Users,
  KeyRound,
  RefreshCw,
  ArrowRight,
} from "lucide-react";

import {
  useDashboardUser,
} from "@/components/layout/DashboardShell";

type RoleRecord = {
  id: number;
  name: string;
  users_count: number;
  permissions_count: number;
  permissions: string[];
};

type ApiResult = {
  roles?: RoleRecord[];
  total?: number;
  message?: string;
};

function label(value: string): string {
  return value
    .replaceAll("_", " ")
    .replaceAll(".", " · ")
    .replace(/\\b\\w/g, (letter) => letter.toUpperCase());
}

export default function RoleCatalog() {
  const user = useDashboardUser();

  const authorized =
    user.roles.includes("system_admin") &&
    user.permissions.includes("users.assign_roles");

  const [roles, setRoles] = useState<RoleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRoles = useCallback(
    async (signal?: AbortSignal) => {
      try {
        const response = await fetch(
          "/api/backend/roles",
          {
            method: "GET",
            credentials: "same-origin",
            cache: "no-store",
            signal,
          }
        );

        const data =
          (await response.json()) as ApiResult;

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load system roles."
          );
        }

        if (!Array.isArray(data.roles)) {
          throw new Error(
            "Laravel returned an unexpected role response."
          );
        }

        if (!signal?.aborted) {
          setRoles(data.roles);
          setError("");
        }
      } catch (reason) {
        if (signal?.aborted) return;

        setError(
          reason instanceof Error
            ? reason.message
            : "Unable to load roles."
        );
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    if (!authorized) return;

    const controller = new AbortController();

    void Promise.resolve().then(() => {
      if (!controller.signal.aborted) {
        return loadRoles(controller.signal);
      }
    });

    return () => controller.abort();
  }, [authorized, loadRoles]);

  if (!authorized) {
    return (
      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
        <h2 className="font-bold text-slate-800">
          System Role Administration
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Only authorized System Administrators can
          view the complete role catalog and manage
          employee role assignments.
        </p>
      </section>
    );
  }

  return (
    <section className="mb-6 min-w-0">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-800">
            System Role Administration
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Live roles and permissions from Laravel
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setLoading(true);
            void loadRoles();
          }}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          Loading system roles...
        </div>
      ) : roles.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
          No system roles returned.
        </div>
      ) : (
        <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
          {roles.map((role) => (
            <article
              key={role.id}
              className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
            >
              <div className="flex min-w-0 items-start gap-3">
                <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                  <ShieldCheck size={22} />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="break-words font-bold text-slate-800">
                    {label(role.name)}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Role #{role.id}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Users size={16} />
                    <span className="text-xs">
                      Employees
                    </span>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-slate-800">
                    {role.users_count}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="flex items-center gap-2 text-slate-500">
                    <KeyRound size={16} />
                    <span className="text-xs">
                      Permissions
                    </span>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-slate-800">
                    {role.permissions_count}
                  </p>
                </div>
              </div>

              <details className="mt-4 rounded-xl border border-slate-100">
                <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-indigo-700">
                  View assigned permissions
                </summary>

                <div className="flex flex-wrap gap-2 border-t border-slate-100 p-3">
                  {role.permissions.map((permission) => (
                    <span
                      key={permission}
                      className="max-w-full break-words rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs text-indigo-700"
                    >
                      {label(permission)}
                    </span>
                  ))}
                </div>
              </details>
            </article>
          ))}
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-indigo-100 bg-indigo-50 p-4 sm:p-5">
        <div className="min-w-0">
          <p className="font-semibold text-indigo-900">
            Assign roles to employees
          </p>
          <p className="mt-1 text-sm text-indigo-800">
            Use the shield icon on an employee record
            to change their assigned role.
          </p>
        </div>

        <Link
          href="/dashboard/users"
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Manage Employees
          <ArrowRight size={17} />
        </Link>
      </div>
    </section>
  );
}
