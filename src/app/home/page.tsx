import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  // ✅ fetch protected data using the token
  const res = await fetch("http://localhost:3000/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const users = await res.json();

  return <pre>{JSON.stringify(users, null, 2)}</pre>;
}
