"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function NewCourseForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !code.trim()) {
      setError("Name and code are required.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          code: code.trim(),
          description: description.trim(),
        }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Failed to create course");
      }

      router.push("/courses");
    } catch (err: any) {
      setError(err?.message ?? "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

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
        <Button className="cursor-pointer" type="submit" disabled={loading}>
          {loading ? "Saving..." : "Create"}
        </Button>
      </div>
    </form>
  );
}
