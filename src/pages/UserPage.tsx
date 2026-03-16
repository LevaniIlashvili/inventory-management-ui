import { useEffect, useState } from "react";
import { type Inventory } from "../types/inventory";
import {
  getUserInventories,
  createInventory,
  updateInventory,
  deleteInventory,
} from "../services/inventoryService";
import InventoryTable from "../components/inventory/InventoryTable";
import InventoryFormModal from "../components/inventory/InventoryFormModal";

export default function UserPage() {
  const [inventories, setInventories] = useState<Inventory[]>([]);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editing, setEditing] = useState<Inventory | null>(null);

  const loadInventories = async () => {
    const data = await getUserInventories();
    setInventories(data);
  };

  useEffect(() => {
    loadInventories();
  }, []);

  const handleCreate = async (data: any) => {
    await createInventory(data);
    setIsAddOpen(false);
    loadInventories();
  };

  const handleEdit = async (data: any) => {
    if (!editing) return;
    await updateInventory(editing.id, data);
    setEditing(null);
    loadInventories();
  };

  const handleDelete = async (ids: string[]) => {
    if (!window.confirm("Delete inventory?")) return;
    await deleteInventory(ids);
    loadInventories();
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Your Inventories</h2>
        <button className="btn btn-success" onClick={() => setIsAddOpen(true)}>
          + Create Inventory
        </button>
      </div>

      <InventoryTable
        inventories={inventories}
        onEdit={setEditing}
        onDelete={handleDelete}
      />

      {isAddOpen && (
        <InventoryFormModal
          onSubmit={handleCreate}
          onClose={() => setIsAddOpen(false)}
        />
      )}

      {editing && (
        <InventoryFormModal
          onSubmit={handleEdit}
          initial={editing}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
