import type {
  ActivityEvent,
  KpiMetric,
  LiveTick,
  MetricsBundle,
  SeriesPoint,
} from "@/features/analytics/types/metrics.types";
import type { User, UserQuery, UserSummary, UserStatus } from "@/features/users/types/user.types";

function mulberry32(seed: number): () => number {
  let value = seed;
  return () => {
    value |= 0;
    value = (value + 0x6d2b79f5) | 0;
    let t = Math.imul(value ^ (value >>> 15), 1 | value);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FIRST_NAMES = [
  "Amelia",
  "Noah",
  "Sofia",
  "Liam",
  "Maya",
  "Ethan",
  "Zara",
  "Lucas",
  "Aisha",
  "Oliver",
  "Elena",
  "Marcus",
  "Priya",
  "Jonas",
  "Hana",
  "Diego",
  "Freya",
  "Ibrahim",
  "Chloe",
  "Kenji",
  "Nadia",
  "Theo",
  "Isla",
  "Rafael",
  "Leila",
  "Felix",
  "Ava",
  "Omar",
  "Nora",
  "Victor",
];

const LAST_NAMES = [
  "Carter",
  "Nakamura",
  "Silva",
  "Okafor",
  "Hansen",
  "Rahman",
  "Petrov",
  "Dubois",
  "Kowalski",
  "Meyer",
  "Andersen",
  "Rossi",
  "Bakker",
  "Novak",
  "Fernandez",
  "Iqbal",
  "Larsen",
  "Moreau",
  "Santos",
  "Weber",
  "Khan",
  "Bennett",
  "Costa",
  "Varga",
  "Lindqvist",
  "Haddad",
  "Moretti",
  "Jensen",
  "Kaur",
  "Fischer",
];

const DEPARTMENTS = ["Engineering", "Sales", "Support", "Finance", "Marketing", "Operations"];
const REGIONS = ["North America", "EMEA", "APAC", "LATAM"];
const STATUSES: UserStatus[] = ["active", "active", "active", "invited", "suspended"];
const ROLES: Role[] = ["staff", "staff", "staff", "manager", "admin"];

function pick<T>(random: () => number, values: readonly T[]): T {
  return values[Math.floor(random() * values.length)] as T;
}

function buildUsers(): User[] {
  const random = mulberry32(20260928);
  const users: User[] = [];

  for (let index = 0; index < 184; index += 1) {
    const first = pick(random, FIRST_NAMES);
    const last = pick(random, LAST_NAMES);
    const name = `${first} ${last}`;
    const joined = new Date(
      Date.UTC(2021 + Math.floor(random() * 5), Math.floor(random() * 12), 1 + Math.floor(random() * 27)),
    );
    const lastActive = new Date(Date.now() - Math.floor(random() * 1000 * 60 * 60 * 24 * 45));

    users.push({
      id: `usr_${String(index + 1).padStart(4, "0")}`,
      name,
      email: `${first}.${last}${index > 0 ? index : ""}@example.com`.toLowerCase(),
      role: pick(random, ROLES),
      department: pick(random, DEPARTMENTS),
      status: pick(random, STATUSES),
      region: pick(random, REGIONS),
      joinedAt: joined.toISOString(),
      lastActiveAt: lastActive.toISOString(),
      revenue: Math.round((500 + random() * 94_500) * 100) / 100,
      orders: Math.floor(random() * 420),
    });
  }

  return users;
}

function compareUsers(a: User, b: User, key: keyof User, direction: SortDirection): number {
  const left = a[key];
  const right = b[key];
  let result = 0;

  if (typeof left === "number" && typeof right === "number") {
    result = left - right;
  } else {
    result = String(left).localeCompare(String(right));
  }

  return direction === "asc" ? result : -result;
}

export const userDatabase: User[] = buildUsers();

export function queryUsers(query: UserQuery): PageResult<User> {
  const { page, pageSize, search, sort, filters } = query;
  const needle = (search ?? "").trim().toLowerCase();

  let rows = userDatabase.filter((user) => {
    if (filters?.role && user.role !== filters.role) return false;
    if (filters?.status && user.status !== filters.status) return false;
    if (filters?.department && user.department !== filters.department) return false;
    if (!needle) return true;
    return (
      user.name.toLowerCase().includes(needle) ||
      user.email.toLowerCase().includes(needle) ||
      user.id.toLowerCase().includes(needle) ||
      user.department.toLowerCase().includes(needle)
    );
  });

  if (sort) {
    rows = [...rows].sort((a, b) => compareUsers(a, b, sort.key as keyof User, sort.direction));
  }

  const total = rows.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(page, 1), pageCount);
  const items = rows.slice((safePage - 1) * pageSize, safePage * pageSize);

  return { items, total, page: safePage, pageSize, pageCount };
}

export function userSummary(): UserSummary {
  const counts = { active: 0, invited: 0, suspended: 0 };
  for (const user of userDatabase) counts[user.status] += 1;
  return {
    total: userDatabase.length,
    ...counts,
    departments: [...DEPARTMENTS],
  };
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function buildSeries(): SeriesPoint[] {
  const random = mulberry32(77);
  const base = 82_000;
  return MONTHS.map((label, index) => {
    const trend = base + index * 6_400;
    const revenue = Math.round(trend + (random() - 0.4) * 24_000);
    return {
      label,
      revenue,
      orders: Math.round(revenue / 148 + (random() - 0.5) * 90),
      target: Math.round(trend * 1.06),
    };
  });
}

function buildKpis(series: SeriesPoint[]): KpiMetric[] {
  const current = series[series.length - 1]?.revenue ?? 0;
  const previous = series[series.length - 2]?.revenue ?? current;
  const revenueDelta = ((current - previous) / Math.max(previous, 1)) * 100;

  return [
    {
      id: "revenue",
      label: "Monthly Revenue",
      value: current,
      format: "currency",
      delta: Number(revenueDelta.toFixed(1)),
      spark: series.slice(-7).map((point) => point.revenue),
      accent: "brand",
    },
    {
      id: "orders",
      label: "Orders Fulfilled",
      value: series.slice(-1)[0]?.orders ?? 0,
      format: "number",
      delta: 4.6,
      spark: series.slice(-7).map((point) => point.orders),
      accent: "success",
    },
    {
      id: "conversion",
      label: "Conversion Rate",
      value: 4.82,
      format: "percent",
      delta: -0.7,
      spark: [3.9, 4.1, 4.0, 4.4, 4.3, 4.6, 4.82],
      accent: "warning",
    },
    {
      id: "churn",
      label: "Churn Ratio",
      value: 1.14,
      format: "percent",
      delta: -12.4,
      spark: [2.4, 2.1, 1.9, 1.8, 1.5, 1.3, 1.14],
      accent: "info",
    },
  ];
}

function buildActivity(): ActivityEvent[] {
  const now = Date.now();
  const seed: Omit<ActivityEvent, "at" | "id">[] = [
    { title: "Role escalated", detail: "Nora Fischer moved from staff to manager", tone: "success" },
    { title: "Sync latency spike", detail: "Payments microservice reached 412ms", tone: "warning" },
    { title: "Bulk import finished", detail: "1,204 customer rows normalized", tone: "info" },
    { title: "Permission denied", detail: "Staff token rejected at /users:manage", tone: "danger" },
    { title: "Deployment promoted", detail: "nexus-web v4.2.0 promoted to production", tone: "info" },
    { title: "Export generated", detail: "Q3 finance report (PDF) downloaded", tone: "success" },
  ];

  return seed.map((event, index) => ({
    ...event,
    id: `act_${index + 1}`,
    at: new Date(now - (index + 1) * 1000 * 60 * (7 + index * 4)).toISOString(),
  }));
}

export function metricsBundle(): MetricsBundle {
  const series = buildSeries();
  return {
    kpis: buildKpis(series),
    series,
    channels: [
      { name: "Organic", value: 34, color: "#6366f1" },
      { name: "Referral", value: 24, color: "#0ea5e9" },
      { name: "Paid Ads", value: 21, color: "#10b981" },
      { name: "Direct", value: 13, color: "#f59e0b" },
      { name: "Social", value: 8, color: "#f43f5e" },
    ],
    activity: buildActivity(),
    funnel: [
      { label: "Visited", visitors: 48_500 },
      { label: "Product view", visitors: 31_200 },
      { label: "Added to cart", visitors: 14_700 },
      { label: "Checkout", visitors: 8_900 },
      { label: "Purchased", visitors: 6_120 },
    ],
    regions: [
      { region: "North America", revenue: 421_300, growth: 8.4 },
      { region: "EMEA", revenue: 318_900, growth: 5.1 },
      { region: "APAC", revenue: 264_150, growth: 12.7 },
      { region: "LATAM", revenue: 96_400, growth: -2.3 },
    ],
    retention: [
      [100, 62, 48, 41, 37, 33],
      [100, 65, 51, 44, 39, 35],
      [100, 58, 46, 40, 36, 31],
      [100, 68, 54, 47, 42, 38],
      [100, 71, 57, 49, 44, 40],
      [100, 66, 53, 45, 41, 37],
    ],
  };
}

export function nextLiveTick(previous?: LiveTick): LiveTick {
  const jitter = (value: number, range: number, min: number, max: number): number =>
    Math.min(max, Math.max(min, value + Math.round((Math.random() - 0.5) * range)));

  const base = previous ?? {
    activeUsers: 1_284,
    ordersPerMin: 46,
    revenueToday: 48_920,
    latencyMs: 128,
    errorRate: 0.42,
    at: new Date().toISOString(),
  };

  return {
    activeUsers: jitter(base.activeUsers, 120, 640, 2_400),
    ordersPerMin: jitter(base.ordersPerMin, 12, 18, 96),
    revenueToday: Math.max(0, base.revenueToday + Math.round(Math.random() * 420)),
    latencyMs: jitter(base.latencyMs, 60, 74, 320),
    errorRate: Math.max(0, Math.round((base.errorRate + (Math.random() - 0.55) * 0.18) * 100) / 100),
    at: new Date().toISOString(),
  };
}
