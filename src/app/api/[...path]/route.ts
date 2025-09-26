import { NextRequest, NextResponse } from "next/server";

const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

async function proxyRequest(
  req: NextRequest,
  method: string,
  params: { path: string[] }
) {
  try {
    const path = params.path.join("/");
    const targetUrl = `${backendUrl}/${path}${req.nextUrl.search}`;

    const res = await fetch(targetUrl, {
      method,
      headers: {
        "content-type": req.headers.get("content-type") || "application/json",
        cookie: req.headers.get("cookie") || "", // ✅ forward cookies from browser
      },
      body: ["POST", "PUT", "PATCH"].includes(method)
        ? await req.text()
        : undefined,
      credentials: "include", // ✅ keep cookies
    });

    // ✅ forward backend response headers (esp. Set-Cookie on login)
    const headers = new Headers();
    res.headers.forEach((value, key) => {
      if (key.toLowerCase() === "set-cookie") {
        headers.append("set-cookie", value);
      } else {
        headers.set(key, value);
      }
    });

    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers,
    });
  } catch (err) {
    console.error(`Proxy error [${method}] →`, err);
    return NextResponse.json(
      { error: "Proxy request failed" },
      { status: 500 }
    );
  }
}

// Handlers
export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> } // 👈 must be Promise
) {
  const params = await ctx.params; // 👈 await
  return proxyRequest(req, "GET", params);
}

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> }
) {
  const params = await ctx.params;
  return proxyRequest(req, "POST", params);
}

export async function PUT(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> }
) {
  const params = await ctx.params;
  return proxyRequest(req, "PUT", params);
}

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> }
) {
  const params = await ctx.params;
  return proxyRequest(req, "PATCH", params);
}

export async function DELETE(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> }
) {
  const params = await ctx.params;
  return proxyRequest(req, "DELETE", params);
}
