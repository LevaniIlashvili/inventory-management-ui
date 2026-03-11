import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ItemsTable from "../components/inventory/ItemsTable";
import {
  getInventoryItems,
  deleteItems,
} from "../services/inventoryItemService";
import { type InventoryItem } from "../types/inventoryItem";

export default function InventoryPage() {
  const { inventoryId } = useParams();

  const [items, setItems] = useState<InventoryItem[]>([]);

  const loadItems = async () => {
    if (!inventoryId) return;

    const data = await getInventoryItems(inventoryId);
    setItems(data);
  };

  useEffect(() => {
    loadItems();
  }, [inventoryId]);

  const handleDelete = async (ids: string[]) => {
    await deleteItems(ids);
    loadItems();
  };

  const handleEdit = (item: InventoryItem) => {
    console.log("edit item", item);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>Inventory Items</h2>

        <button className="btn btn-success">Add Item</button>
      </div>

      <ItemsTable items={items} onDelete={handleDelete} onEdit={handleEdit} />
    </div>
  );
}
