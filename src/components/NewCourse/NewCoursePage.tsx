"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/UserContext";
import NewCourseForm from "./NewCourseForm";

export default function NewCoursePageClient() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== "professor") {
        router.replace("/unauthorizedUser");
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return <p className="p-6">Loading…</p>;
  }

  // At this point, user is guaranteed to be a professor
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Create course</h1>
      <NewCourseForm />
    </div>
  );
}
