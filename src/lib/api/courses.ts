import { Course } from "@/components/courses/coursesColumns";

export async function fetchCourses(
  limit = 10,
  cursor?: number,
  filters: Record<string, string> = {}
): Promise<{ data: Course[]; nextCursor?: number | null }> {
  const params = new URLSearchParams({
    limit: String(limit),
    ...(cursor ? { cursor: String(cursor) } : {}),
    ...filters,
  });

  const res = await fetch(`/api/courses?${params.toString()}`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch courses");
  }

  return res.json();
}
