import { NextResponse } from "next/server";
import { getPlatformStats } from "@/lib/utils/platform";

export async function GET() {
  const stats = await getPlatformStats();
  return NextResponse.json(stats);
}
