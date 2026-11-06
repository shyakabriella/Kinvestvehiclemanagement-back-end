"use client";

import { useEffect, useRef, useState } from "react";
import { X, AlertTriangle, CheckCircle2 } from "lucide-react";

type Employee = {
  id: number;
  name: string;
  email: string;
  status: string;
};

type Props = {
  employee: Employee;
  onClose: () => void;
  onSaved: () => void;
};

export default function EmployeeStatusModal({
  employee,
  onClose,
  onSaved,
}: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const active = employee.status === "active";
  const newStatus = active ? "suspended" : "active";

  useEffect(() => {
    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    dialogRef.current?.focus();

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        if (!loading) onClose();
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      previousFocus?.focus();
    };
  }, [loading, onClose]);

  function close() {
    if (!loading) onClose();
  }

  async function confirm() {
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/backend/users/${employee.id}/status`,
        {
          method: "PATCH",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setError(
          result.message || "Unable to update employee."
        );
        return;
      }

      onSaved();
    } catch {
      setError("Cannot connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/60 px-4 py-6">
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="status-dialog-title"
        className="w-full max-w-[calc(100vw-1.5rem)] max-w-md rounded-2xl border border-slate-200 bg-white p-0 text-slate-800 shadow-2xl max-h-[calc(100dvh-1.5rem)] overflow-y-auto"
      >
      <div className="flex items-center justify-between border-b border-slate-100 p-5">
        <h2 id="status-dialog-title" className="text-lg font-bold">
          {active ? "Suspend Employee" : "Reactivate Employee"}
        </h2>

        <button
          type="button"
          onClick={close}
          disabled={loading}
          aria-label="Close"
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
        >
          <X size={20} />
        </button>
      </div>

      <div className="p-4 sm:p-6">
        <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${
          active
            ? "bg-amber-50 text-amber-600"
            : "bg-green-50 text-green-600"
        }`}>
          {active
            ? <AlertTriangle size={24} />
            : <CheckCircle2 size={24} />}
        </div>

        <p className="text-sm leading-6 text-slate-600">
          Are you sure you want to{" "}
          <strong>{active ? "suspend" : "reactivate"}</strong>{" "}
          <strong>{employee.name}</strong>?
        </p>

        <p className="mt-2 text-xs text-slate-500">
          {employee.email}
        </p>

        <p className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
          {active
            ? "The employee will no longer access protected KFMS services."
            : "The employee will be allowed to sign in again."}
        </p>

        {error && (
          <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={close}
            disabled={loading}
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={confirm}
            disabled={loading}
            className={`rounded-xl px-5 py-3 text-sm font-semibold text-white disabled:opacity-50 ${
              active
                ? "bg-amber-600 hover:bg-amber-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading
              ? "Saving..."
              : active
                ? "Suspend Employee"
                : "Reactivate Employee"}
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}
