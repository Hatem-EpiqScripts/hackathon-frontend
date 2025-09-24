import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    jwtSecret: process.env.JWT_SECRET || "not set",
  });
}
