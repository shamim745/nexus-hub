import { NextResponse } from "next/server";
import { metricsBundle } from "@/lib/mock/dashboardData";

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 120));
  return NextResponse.json({ data: metricsBundle() });
}
