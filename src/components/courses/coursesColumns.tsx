"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export type Course = {
  id: number;
  name: string;
  code: string;
  description: string;
  professorId: number;
};

async function updateCourse(courseId: number, updates: Partial<Course>) {
  const response = await fetch(`/api/courses/${courseId}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const error = await response.json();
    alert(error.message || "Failed to update course");
    return false;
  }

  return true;
}

async function deleteCourse(courseId: number) {
  const response = await fetch(`/api/courses/${courseId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    alert(error.message || "Failed to delete course");
    return false;
  }

  return true;
}

type CourseColumnsProps = {
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
};

export const courseColumns = ({
  setCourses,
}: CourseColumnsProps): ColumnDef<Course>[] => [
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
    header: "Description",
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => {
      const course = row.original;

      const [open, setOpen] = useState(false);
      const [deleteOpen, setDeleteOpen] = useState(false);
      const [form, setForm] = useState({
        name: course.name,
        code: course.code,
        description: course.description,
      });

      const [saving, setSaving] = useState(false);
      const [deleting, setDeleting] = useState(false);

      const handleSave = async () => {
        setSaving(true);
        try {
          const success = await updateCourse(course.id, form);
          if (success) {
            setCourses((prev) =>
              prev.map((c) => (c.id === course.id ? { ...c, ...form } : c))
            );
            setOpen(false);
            alert("Course updated successfully");
          }
        } finally {
          setSaving(false);
        }
      };

      const handleDelete = async () => {
        setDeleting(true);
        try {
          const success = await deleteCourse(course.id);
          if (success) {
            setCourses((prev) => prev.filter((c) => c.id !== course.id));
            setDeleteOpen(false);
            alert("Course deleted successfully");
          }
        } finally {
          setDeleting(false);
        }
      };

      return (
        <>
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
              <DropdownMenuItem onClick={() => setOpen(true)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDeleteOpen(true)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Course</DialogTitle>
              </DialogHeader>

              <div className="flex flex-col gap-4">
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Course name"
                />
                <Input
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  placeholder="Course code"
                />
                <Input
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Course description"
                />
              </div>

              <DialogFooter>
                <Button variant="secondary" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to delete this course?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. It will permanently remove{" "}
                  <strong>{course.name}</strong> from the system.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={deleting}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={deleting}>
                  {deleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      );
    },
  },
];
