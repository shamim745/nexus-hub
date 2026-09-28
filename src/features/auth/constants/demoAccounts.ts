export interface SessionSnapshot {
  email: string;
  password: string;
}

export const DEMO_ACCOUNTS: { label: string; role: Role; snapshot: SessionSnapshot }[] = [
  { label: "Administrator", role: "admin", snapshot: { email: "admin@nexus.io", password: "demo1234" } },
  { label: "Manager", role: "manager", snapshot: { email: "manager@nexus.io", password: "demo1234" } },
  { label: "Staff", role: "staff", snapshot: { email: "staff@nexus.io", password: "demo1234" } },
];
