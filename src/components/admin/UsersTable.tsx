import { useState } from "react";
import { type User } from "../../types/user";

interface Props {
  users: User[];
  onDelete: (ids: string[]) => void;
  onBlock: (ids: string[]) => void;
  onUnblock: (ids: string[]) => void;
  onGrantAdmin: (ids: string[]) => void;
  onRevokeAdmin: (ids: string[]) => void;
}

export default function UsersTable({
  users,
  onDelete,
  onBlock,
  onUnblock,
  onGrantAdmin,
  onRevokeAdmin,
}: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === users.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(users.map((u) => u.id));
    }
  };

  const disabled = selectedIds.length === 0;

  return (
    <div>
      {/* Action Buttons */}
      <div className="mb-3">
        <button
          className="btn btn-danger me-2"
          disabled={disabled}
          onClick={() => onDelete(selectedIds)}
        >
          Delete
        </button>

        <button
          className="btn btn-warning me-2"
          disabled={disabled}
          onClick={() => onBlock(selectedIds)}
        >
          Block
        </button>

        <button
          className="btn btn-success me-2"
          disabled={disabled}
          onClick={() => onUnblock(selectedIds)}
        >
          Unblock
        </button>

        <button
          className="btn btn-primary me-2"
          disabled={disabled}
          onClick={() => onGrantAdmin(selectedIds)}
        >
          Grant Admin
        </button>

        <button
          className="btn btn-secondary"
          disabled={disabled}
          onClick={() => onRevokeAdmin(selectedIds)}
        >
          Revoke Admin
        </button>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={
                  users.length > 0 && selectedIds.length === users.length
                }
                onChange={toggleSelectAll}
              />
            </th>

            <th>Username</th>
            <th>Email</th>
            <th>Name</th>
            <th>Blocked</th>
            <th>Created</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(user.id)}
                  onChange={() => toggleSelect(user.id)}
                />
              </td>

              <td>{user.username}</td>

              <td>{user.email}</td>

              <td>
                {user.firstName} {user.lastName}
              </td>

              <td>{user.isBlocked ? "Yes" : "No"}</td>

              <td>{new Date(user.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
