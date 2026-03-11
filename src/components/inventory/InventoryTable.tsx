import { useState } from "react";
import { type Inventory } from "../../types/inventory";
import { useNavigate } from "react-router-dom";

interface Props {
  inventories: Inventory[];
  onEdit: (inventory: Inventory) => void;
  onDelete: (ids: string[]) => void;
}

export default function InventoryTable({
  inventories,
  onEdit,
  onDelete,
}: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const navigate = useNavigate();

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === inventories.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(inventories.map((i) => i.id));
    }
  };

  const handleEdit = () => {
    const inv = inventories.find((i) => i.id === selectedIds[0]);
    if (inv) onEdit(inv);
  };

  const handleDelete = () => {
    if (selectedIds.length === 0) return;
    onDelete(selectedIds);
    setSelectedIds([]);
  };

  return (
    <div>
      <div className="mb-2">
        <button
          className="btn btn-warning me-2"
          disabled={selectedIds.length !== 1}
          onClick={handleEdit}
        >
          Edit
        </button>

        <button
          className="btn btn-danger"
          disabled={selectedIds.length === 0}
          onClick={handleDelete}
        >
          Delete Selected
        </button>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={
                  inventories.length > 0 &&
                  selectedIds.length === inventories.length
                }
                onChange={toggleSelectAll}
              />
            </th>
            <th>Title</th>
            <th>Description</th>
            <th>Public</th>
          </tr>
        </thead>

        <tbody>
          {inventories.map((inv) => (
            <tr
              key={inv.id}
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/inventories/${inv.id}`)}
            >
              <td>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(inv.id)}
                  onChange={() => toggleSelect(inv.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              </td>

              <td>{inv.title}</td>
              <td>{inv.description}</td>
              <td>{inv.isPublic ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
