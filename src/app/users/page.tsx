import { DataTable } from "@/components/DataTable";
import { userColumns, User } from "./usersColumns";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
export default async function UsersPage() {
  const token = (await cookies()).get("token")?.value;

  const res = await fetch("http://localhost:3000/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const users = await res.json();

  if (!Array.isArray(users)) {
    redirect("/unauthorized");
  }
  const safeUsers: User[] = users.map((user: any) => ({
    id: user.id,
    userName: user.userName,
    email: user.email,
    phone: user.phone,
    userRole: (user.userRole ?? "unknown").toLowerCase(),
  }));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Users</h1>
      <DataTable columns={userColumns} data={safeUsers} />
    </div>
  );
}
