"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  UserRound,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

const items = [
  {
    label: "Employee Management",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    label: "My Profile",
    href: "/dashboard/profile",
    icon: UserRound,
  },
  {
    label: "Account Security",
    href: "/dashboard/security",
    icon: LockKeyhole,
  },
  {
    label: "Roles & Permissions",
    href: "/dashboard/roles",
    icon: ShieldCheck,
  },
];

export default function EmployeeModuleTabs() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Employee module navigation"
      className="mb-5 grid w-full min-w-0 grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm sm:mb-6 sm:flex sm:flex-wrap sm:items-center sm:p-3"
    >
      {items.map((item) => {
        const Icon = item.icon;

        const active =
          pathname === item.href ||
          pathname.startsWith(item.href + "/");

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            title={item.label}
            className={`flex min-h-14 min-w-0 items-center justify-center gap-2 rounded-xl px-2 py-2.5 text-center text-[11px] font-semibold leading-tight transition focus-visible:outline-2 focus-visible:outline-indigo-500 min-[400px]:text-xs sm:min-h-11 sm:flex-none sm:px-4 sm:py-3 sm:text-sm ${
              active
                ? "bg-indigo-600 text-white shadow-sm"
                : "border border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
            }`}
          >
            <Icon
              size={17}
              className="shrink-0"
              aria-hidden="true"
            />
            <span className="min-w-0 break-words">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
