"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/DataTable";
import { userColumns, User } from "./usersColumns";
import { useUser } from "@/lib/UserContext";

export default function UsersPageClient() {
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const router = useRouter();

  // ✅ get current user from context
  const { user, loading } = useUser();

  useEffect(() => {
    // wait until we know user state
    if (loading) return;

    if (!user || user.role !== "admin") {
      router.push("/unauthorized");
      return;
    }

    async function loadUsers() {
      try {
        const res = await fetch(`/api/users`, { credentials: "include" });

        if (!res.ok) {
          router.push("/unauthorized");
          return;
        }

        const usersData = await res.json();
        if (!Array.isArray(usersData)) {
          router.push("/unauthorized");
          return;
        }

        setUsers(
          usersData.map((u: any) => ({
            id: u.userId, // ✅ adjust to match your backend field
            userName: u.userName, // ✅ lowercase `username`
            email: u.email,
            phone: u.phone,
            userRole: (u.role ?? "unknown").toLowerCase(),
          }))
        );
      } catch (err) {
        console.error("Failed to load users:", err);
        router.push("/unauthorized");
      } finally {
        setLoadingUsers(false);
      }
    }

    loadUsers();
  }, [user, loading, router]);

  if (loading || loadingUsers) return <p>Loading users…</p>;

  return <DataTable columns={userColumns} data={users} />;
}
