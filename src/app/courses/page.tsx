import { DataTable } from "@/components/DataTable";
import { courseColumns, Course } from "./coursesColumns";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function CoursesPage() {
  const res = await fetch("http://localhost:3000/courses", {
    next: { revalidate: 0 },
  });
  const courses = await res.json();

  const safeCourses: Course[] = courses.map((course: any) => ({
    id: course.id,
    name: course.name,
    code: course.code,
    description: course.description,
  }));

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">All courses</h1>
        <Link href="/courses/newCourse">
          <Button className="cursor-pointer">New course</Button>
        </Link>
      </div>
      <DataTable columns={courseColumns} data={safeCourses} />
    </div>
  );
}
