"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/currentUser";

export default function TestUserPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser().then((u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>User Info</h1>
      {user ? (
        <pre>{JSON.stringify(user, null, 2)}</pre>
      ) : (
        <p>No user found or not logged in</p>
      )}
    </div>
  );
}
