import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const res = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const error = await res.json();
      return NextResponse.json(
        { message: error.message || "Login failed" },
        { status: res.status }
      );
    }

    const { accessToken } = await res.json();
    console.log("Access Token:", accessToken);
    const response = NextResponse.json({
      success: true,
      accessToken, // ✅ Now returning the token to frontend
    });

    response.cookies.set("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
