import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let decoded: any;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  if (decoded.role !== "professor") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const userId = decoded.sub; // user ID from token
  console.log("Decoded userId:", userId);
  // 1. Fetch professor info by userId
  const profRes = await fetch(`${baseUrl}/professors/${userId}`);

  if (!profRes.ok) {
    return NextResponse.json(
      { message: "Professor not found" },
      { status: 404 }
    );
  }

  const professor = await profRes.json();

  const body = await req.json();

  // 2. Use professor.id as professorId
  const newCourse = {
    ...body,
    professorId: professor.id,
  };

  // 3. Create course
  const backendRes = await fetch(`${baseUrl}/courses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newCourse),
  });

  if (!backendRes.ok) {
    const errMsg = await backendRes.text();
    return NextResponse.json(
      { message: errMsg },
      { status: backendRes.status }
    );
  }

  const result = await backendRes.json();
  return NextResponse.json(result);
}
