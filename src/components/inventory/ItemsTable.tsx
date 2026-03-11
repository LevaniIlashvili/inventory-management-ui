import { useState } from "react";
import { type InventoryItem } from "../../types/inventoryItem";

interface Props {
  items: InventoryItem[];
  onDelete: (ids: string[]) => void;
  onEdit: (item: InventoryItem) => void;
}

export default function ItemsTable({ items, onDelete, onEdit }: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === items.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map((i) => i.id));
    }
  };

  const handleEdit = () => {
    const item = items.find((i) => i.id === selectedIds[0]);
    if (item) onEdit(item);
  };

  return (
    <div>
      <div className="mb-3">
        <button
          className="btn btn-primary me-2"
          disabled={selectedIds.length !== 1}
          onClick={handleEdit}
        >
          Edit
        </button>

        <button
          className="btn btn-danger"
          disabled={selectedIds.length === 0}
          onClick={() => onDelete(selectedIds)}
        >
          Delete
        </button>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={
                  items.length > 0 && selectedIds.length === items.length
                }
                onChange={toggleSelectAll}
              />
            </th>

            <th>Custom ID</th>
            <th>Created At</th>
            <th>Fields</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(item.id)}
                  onChange={() => toggleSelect(item.id)}
                />
              </td>

              <td>{item.customId}</td>

              <td>{new Date(item.createdAt).toLocaleDateString()}</td>

              <td>{item.customFieldValues.map((f) => f.value).join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
