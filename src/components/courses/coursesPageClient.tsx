"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/DataTable";
import { courseColumns, Course } from "./coursesColumns";
import { useUser } from "@/lib/UserContext";
import { fetchCourses } from "@/lib/api/courses";
import { FilterBar } from "../ui/FilterBar";

export default function CoursesPageClient() {
  const [pageCache, setPageCache] = useState<
    Partial<Record<string, { data: Course[]; nextCursor?: number | null }>>
  >({});
  const [currentCursor, setCurrentCursor] = useState<number | "start">("start");
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [cursorHistory, setCursorHistory] = useState<(number | "start")[]>([
    "start",
  ]);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const { user, loading: userLoading } = useUser();

  function getCacheKey(cursor: number | "start", appliedFilters = filters) {
    return JSON.stringify({ cursor, filters: appliedFilters });
  }

  async function loadCourses(
    cursor: number | "start",
    isNext = true,
    appliedFilters = filters
  ) {
    const cacheKey = getCacheKey(cursor, appliedFilters);

    if (pageCache[cacheKey]) {
      setCurrentCursor(cursor);
      if (isNext) setCursorHistory((prev) => [...prev, cursor]);
      else setCursorHistory((prev) => prev.slice(0, -1));
      return;
    }

    setLoadingCourses(true);
    const realCursor = cursor === "start" ? undefined : cursor;
    const res = await fetchCourses(10, realCursor, appliedFilters);

    setPageCache((prev) => ({ ...prev, [cacheKey]: res }));
    setCurrentCursor(cursor);

    if (isNext) {
      if (cursor !== "start") {
        setCursorHistory((prev) => [...prev, cursor]);
      }
    } else {
      setCursorHistory((prev) => prev.slice(0, -1));
    }

    setLoadingCourses(false);
  }

  function handleNext() {
    const nextCursor =
      pageCache[getCacheKey(currentCursor, filters)]?.nextCursor;
    if (nextCursor) loadCourses(nextCursor, true, filters);
  }

  function handlePrevious() {
    if (cursorHistory.length > 1) {
      const prevCursor = cursorHistory[cursorHistory.length - 2];
      loadCourses(prevCursor, false, filters);
    }
  }

  useEffect(() => {
    loadCourses("start", true, filters);
  }, [filters]); //reload when filters change

  if (
    (loadingCourses && !pageCache[getCacheKey(currentCursor)]) ||
    userLoading
  ) {
    return <p>Loading courses…</p>;
  }

  const canCreateCourse = user?.role === "professor";
  const currentData =
    pageCache[getCacheKey(currentCursor, filters)]?.data ?? [];

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">All courses</h1>
      </div>
      <div className="flex items-center justify-between mb-4">
        <FilterBar
          filters={[
            {
              key: "code",
              label: "Course Code",
              placeholder: "Filter by code...",
            },
          ]}
          onApply={(newFilters) => {
            setFilters(newFilters);
            setCursorHistory(["start"]);
            setPageCache({});
            loadCourses("start", true, newFilters);
          }}
          onClear={() => {
            setFilters({});
            setCursorHistory(["start"]);
            setPageCache({});
            loadCourses("start", true, {});
          }}
        />
        {canCreateCourse && (
          <Link href="/newCourse">
            <Button className="cursor-pointer">New course</Button>
          </Link>
        )}
      </div>

      <DataTable
        columns={courseColumns({ setCourses: () => {} })}
        data={currentData}
        onNextPage={handleNext}
        onPreviousPage={handlePrevious}
        hasNextPage={
          !!pageCache[getCacheKey(currentCursor, filters)]?.nextCursor
        }
        hasPreviousPage={cursorHistory.length > 1}
      />
    </>
  );
}
