import { useState } from "react";
import type { InventoryItem } from "../../types/inventoryItem";
import type { InventoryCustomField } from "../../types/inventoryDetails";

interface Props {
  items: InventoryItem[];
  customFields: InventoryCustomField[];
  onDelete: (ids: string[]) => void;
  onEdit: (item: InventoryItem) => void;
  hasWriteAccess?: boolean;
}

export default function ItemsTable({
  items,
  customFields,
  onDelete,
  onEdit,
  hasWriteAccess = false,
}: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const displayFields = customFields.filter((f) => f.shouldBeDisplayed);

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
      {hasWriteAccess && (
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
      )}

      <table className="table table-striped">
        <thead>
          <tr>
            {hasWriteAccess && (
              <th>
                <input
                  type="checkbox"
                  checked={
                    items.length > 0 && selectedIds.length === items.length
                  }
                  onChange={toggleSelectAll}
                />
              </th>
            )}
            <th>Custom ID</th>
            <th>Created At</th>

            {displayFields.map((field) => (
              <th key={field.id}>{field.title}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              {hasWriteAccess && (
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item.id)}
                    onChange={() => toggleSelect(item.id)}
                  />
                </td>
              )}
              <td>{item.customId}</td>
              <td>{new Date(item.createdAt).toLocaleDateString()}</td>

              {displayFields.map((field) => {
                const customValue = item.customFieldValues.find(
                  (v) => v.inventoryCustomFieldId === field.id,
                );

                const displayValue = customValue?.value
                  ? customValue.value
                  : "null";

                return <td key={field.id}>{displayValue}</td>;
              })}
            </tr>
          ))}

          {items.length === 0 && (
            <tr>
              <td
                colSpan={3 + displayFields.length}
                className="text-center text-muted"
              >
                No items found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
