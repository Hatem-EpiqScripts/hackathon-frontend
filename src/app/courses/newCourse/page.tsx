import NewCourseForm from "./NewCourseForm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
export default async function NewCoursePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/home");
  }
  let decoded: any;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!);
  } catch (err) {
    console.error("JWT error:", err);
    redirect("/unauthorized");
  }

  if (decoded.role !== "professor") {
    redirect("/unauthorizedUser");
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Create course</h1>
      <NewCourseForm />
    </div>
  );
}
