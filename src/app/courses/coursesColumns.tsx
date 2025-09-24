"use client";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type Course = {
  id: number;
  name: string;
  code: string;
  description: string;
  professorId: number;
};

async function deleteCourse(courseId: number) {
  try {
    const response = await fetch(`http://localhost:3000/courses/${courseId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      alert(error.message || "Failed to delete course");
      return;
    }

    alert("Course deleted successfully");
    // TODO: Update your UI here, e.g. remove course from state or refetch data
  } catch (error) {
    alert("An error occurred while deleting the course");
    console.error(error);
  }
}

export const courseColumns: ColumnDef<Course>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "description",
    header: "description",
  },

  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => {
      const course = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{course.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => deleteCourse(course.id)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
