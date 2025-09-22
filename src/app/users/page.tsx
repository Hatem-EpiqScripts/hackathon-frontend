import { DataTable } from "@/components/DataTable";
import { userColumns, User } from "./usersColumns";

export default async function UsersPage() {
  const res = await fetch("http://localhost:3000/users", {
    next: { revalidate: 0 }, // SSR (no caching)
  });
  const users = await res.json();

  const safeUsers: User[] = users.map((user: any) => ({
    id: user.id,
    userName: user.userName,
    email: user.email,
    phone: user.phone,
    userRole: user.userRole.toLowerCase(),
  }));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Users</h1>
      <DataTable columns={userColumns} data={safeUsers} />
    </div>
  );
}
