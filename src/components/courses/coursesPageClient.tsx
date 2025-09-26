"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/DataTable";
import { courseColumns, Course } from "./coursesColumns";
import { useUser } from "@/lib/UserContext";

export default function CoursesPageClient() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  const { user, loading: userLoading } = useUser();

  useEffect(() => {
    async function loadCourses() {
      try {
        const coursesRes = await fetch("/api/courses", {
          method: "GET",
          credentials: "include",
        });
        const coursesData = await coursesRes.json();

        setCourses(
          coursesData.map((course: any) => ({
            id: course.id,
            name: course.name,
            code: course.code,
            description: course.description,
            professorId: course.professorId,
          }))
        );
      } catch (err) {
        console.error("Failed to load courses:", err);
      } finally {
        setLoadingCourses(false);
      }
    }

    loadCourses();
  }, []);

  if (loadingCourses || userLoading) {
    return <p>Loading courses…</p>;
  }

  const canCreateCourse = user?.role === "professor";

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">All courses</h1>
        {canCreateCourse && (
          <Link href="/newCourse">
            <Button className="cursor-pointer">New course</Button>
          </Link>
        )}
      </div>

      <DataTable columns={courseColumns({ setCourses })} data={courses} />
    </>
  );
}
