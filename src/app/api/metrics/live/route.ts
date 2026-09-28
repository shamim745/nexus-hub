import { NextResponse } from "next/server";
import { nextLiveTick } from "@/lib/mock/dashboardData";

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 40 + Math.random() * 80));
  return NextResponse.json({ data: nextLiveTick() });
}
