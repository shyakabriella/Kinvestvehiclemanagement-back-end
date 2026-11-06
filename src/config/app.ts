export const appConfig = {
  name: "Kinvest Fleet Management System",
  shortName: "KFMS",
  description: "Company Fleet and Digital Vehicle Logbook Management System",

  api: {
    version: "v1",
  },

  roles: {
    systemAdmin: "system_admin",
    fleetAdmin: "fleet_admin",
    management: "management",
    employee: "employee",
  },
} as const;
