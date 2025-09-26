import UsersPageClient from "@/components/users/UsersPageClient";

export default function UsersPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Users</h1>
      <UsersPageClient />
    </div>
  );
}
