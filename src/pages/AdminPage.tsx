import { useEffect, useState } from "react";
import UsersTable from "../components/admin/UsersTable";
import {
  getUsers,
  deleteUsers,
  blockUsers,
  unblockUsers,
  grantAdmins,
  revokeAdmins,
} from "../services/userService";
import { type User } from "../types/user";

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);

  const loadUsers = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (ids: string[]) => {
    await deleteUsers(ids);
    loadUsers();
  };

  const handleBlock = async (ids: string[]) => {
    await blockUsers(ids);
    loadUsers();
  };

  const handleUnblock = async (ids: string[]) => {
    await unblockUsers(ids);
    loadUsers();
  };

  const handleGrantAdmin = async (ids: string[]) => {
    await grantAdmins(ids);
    loadUsers();
  };

  const handleRevokeAdmin = async (ids: string[]) => {
    await revokeAdmins(ids);
    loadUsers();
  };

  return (
    <div className="container mt-4">
      <h2>Users Management</h2>

      <UsersTable
        users={users}
        onDelete={handleDelete}
        onBlock={handleBlock}
        onUnblock={handleUnblock}
        onGrantAdmin={handleGrantAdmin}
        onRevokeAdmin={handleRevokeAdmin}
      />
    </div>
  );
}
