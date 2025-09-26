"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useUser } from "@/lib/UserContext";

export default function NewCourseForm() {
  const router = useRouter();
  const { user, loading } = useUser();

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !code.trim()) {
      setError("Name and code are required.");
      return;
    }

    if (!user) {
      setError("You must be logged in.");
      return;
    }

    if (user.role !== "professor") {
      setError("Only professors can create courses.");
      return;
    }

    setSaving(true);
    try {
      // determine user id from returned user object (common fields)
      const userId = user.userId;
      if (!userId)
        throw new Error("Cannot determine user id from current user.");

      // fetch professor record by userId
      const profRes = await fetch(`/api/professors/${userId}`, {
        credentials: "include",
      });
      if (!profRes.ok) {
        const text = await profRes.text().catch(() => null);
        throw new Error(text || "Professor not found");
      }
      const professor = await profRes.json();
      const professorId = professor?.id;
      if (!professorId) throw new Error("Professor record missing id");

      // create course
      const res = await fetch(`/api/courses`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          code: code.trim(),
          description: description.trim(),
          professorId,
        }),
      });

      if (!res.ok) {
        const msg = await res.text().catch(() => null);
        throw new Error(msg || "Failed to create course");
      }

      router.push("/courses");
    } catch (err: any) {
      setError(err?.message ?? "Unexpected error");
    } finally {
      setSaving(false);
    }
  }

  // handle states
  if (loading) return <p>Loading...</p>;
  if (!user) return <p>You must be logged in to create a course.</p>;
  if (user.role !== "professor")
    return (
      <p className="text-red-600">You are not allowed to create courses.</p>
    );

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          className="w-full rounded border px-3 py-2 text-sm"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Code</label>
        <input
          className="w-full rounded border px-3 py-2 text-sm"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          className="w-full rounded border px-3 py-2 text-sm"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}

      <div className="flex justify-end gap-2">
        <Button
          className="cursor-pointer"
          type="button"
          variant="secondary"
          onClick={() => router.push("/courses")}
        >
          Cancel
        </Button>
        <Button className="cursor-pointer" type="submit" disabled={saving}>
          {saving ? "Saving..." : "Create"}
        </Button>
      </div>
    </form>
  );
}
