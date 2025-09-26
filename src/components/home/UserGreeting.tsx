"use client";

import { useUser } from "@/lib/UserContext";

export default function UserGreeting() {
  const { user, loading } = useUser();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <h1 className="text-2xl font-bold">Welcome to My Academy 🎓</h1>;
  }

  return <h1 className="text-2xl font-bold">Welcome back, {user.username}!</h1>;
}
