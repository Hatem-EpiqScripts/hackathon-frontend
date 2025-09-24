export async function getCurrentUser(): Promise<{
  userId: number;
  email: string;
  userRole: string;
} | null> {
  try {
    const res = await fetch("http://localhost:3000/auth/me", {
      method: "GET",
      credentials: "include", // ✅ cookie automatically sent
    });

    if (!res.ok) return null;

    return await res.json();
  } catch (err) {
    console.error("Failed to fetch current user:", err);
    return null;
  }
}
