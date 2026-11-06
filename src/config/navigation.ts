export interface NavigationItem {
  title: string;
  href: string;
  icon: string;
  permission?: string;
}

export const navigationItems: NavigationItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "layout-dashboard",
    permission: "dashboard.view",
  },
  {
    title: "Employees",
    href: "/dashboard/users",
    icon: "users",
    permission: "users.view",
  },
  {
    title: "Roles & Permissions",
    href: "/dashboard/roles",
    icon: "shield",
    permission: "roles.view",
  },
  {
    title: "Vehicles",
    href: "/dashboard/vehicles",
    icon: "car-front",
    permission: "vehicles.view",
  },
  {
    title: "Bookings",
    href: "/dashboard/bookings",
    icon: "calendar",
    permission: "bookings.view_all",
  },
  {
    title: "Trips & Logbook",
    href: "/dashboard/trips",
    icon: "route",
    permission: "trips.view_all",
  },
  {
    title: "Maintenance",
    href: "/dashboard/maintenance",
    icon: "wrench",
    permission: "maintenance.view",
  },
  {
    title: "Reports",
    href: "/dashboard/reports",
    icon: "chart-column",
    permission: "reports.view",
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: "settings",
    permission: "settings.view",
  },
];

export const accountNavigation = [
  {
    title: "My Profile",
    href: "/dashboard/profile",
    icon: "user-round",
  },
  {
    title: "Security",
    href: "/dashboard/security",
    icon: "lock",
  },
];
