import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ItemsTable from "../components/inventory/ItemsTable";
import AddItemModal from "../components/inventory/AddItemModal";
import {
  getInventoryItems,
  deleteItems,
} from "../services/inventoryItemService";
import { getInventory } from "../services/inventoryService";
import type { InventoryItem } from "../types/inventoryItem";
import type { InventoryDetails } from "../types/inventoryDetails";
import GeneralSettingsTab from "../components/inventory/GeneralSettingsTab";
import CustomIdTab from "../components/inventory/CustomIdTab";
import CustomFieldsTab from "../components/inventory/CustomFieldsTab";
import EditItemModal from "../components/inventory/EditItemModal";
import StatisticsTab from "../components/inventory/StatisticsTab";
import { useAuth } from "../context/AuthContext";

export default function InventoryPage() {
  const params = useParams();
  const inventoryId = params.inventoryId || params.id;

  const { auth } = useAuth();
  const user = auth?.user;

  const [inventory, setInventory] = useState<InventoryDetails | null>(null);
  const [items, setItems] = useState<InventoryItem[]>([]);

  const [activeTab, setActiveTab] = useState<string>("items");
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const loadData = async () => {
    if (!inventoryId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const [invData, itemsData] = await Promise.all([
        getInventory(inventoryId),
        getInventoryItems(inventoryId),
      ]);
      setInventory(invData);
      setItems(itemsData);
    } catch (error) {
      console.error("Failed to load inventory data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [inventoryId]);

  const handleDeleteItem = async (ids: string[]) => {
    try {
      await deleteItems(ids);
      await loadData();
    } catch (error) {
      console.error("Failed to delete items:", error);
    }
  };

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
  };

  const handleEditItemSuccess = () => {
    setEditingItem(null);
    loadData();
  };

  const handleAddItemSuccess = () => {
    setIsAddModalOpen(false);
    loadData();
  };

  if (isLoading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!inventory) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">Inventory not found.</div>
      </div>
    );
  }

  const isCreator = user?.id === inventory.createdBy;
  const isAdmin = user?.roles?.includes("Admin");

  const canManageInventory = isCreator || isAdmin;

  const hasWriteAccess = !!user && (canManageInventory || inventory.isPublic);
  // inventory.accessList?.some((a: any) => a.userId === user?.id);

  return (
    <div className="container mt-4">
      <div className="mb-4">
        <h2>{inventory.title}</h2>
        {inventory.description && (
          <p className="text-muted">{inventory.description}</p>
        )}
      </div>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "items" ? "active" : ""}`}
            onClick={() => setActiveTab("items")}
          >
            Items
          </button>
        </li>

        {canManageInventory && (
          <>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "general" ? "active" : ""}`}
                onClick={() => setActiveTab("general")}
              >
                General Settings
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "custom-id" ? "active" : ""}`}
                onClick={() => setActiveTab("custom-id")}
              >
                Custom ID Format
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "fields" ? "active" : ""}`}
                onClick={() => setActiveTab("fields")}
              >
                Custom Fields
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "access" ? "active" : ""}`}
                onClick={() => setActiveTab("access")}
              >
                Access Settings
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "stats" ? "active" : ""}`}
                onClick={() => setActiveTab("stats")}
              >
                Statistics
              </button>
            </li>
          </>
        )}
      </ul>

      <div className="tab-content">
        {activeTab === "items" && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4>Inventory Items</h4>
              {hasWriteAccess && (
                <button
                  className="btn btn-success"
                  onClick={() => setIsAddModalOpen(true)}
                >
                  Add Item
                </button>
              )}
            </div>

            <ItemsTable
              items={items}
              customFields={inventory.customFields}
              onDelete={handleDeleteItem}
              onEdit={handleEditItem}
              hasWriteAccess={hasWriteAccess}
            />
          </div>
        )}

        {canManageInventory && activeTab === "general" && (
          <GeneralSettingsTab
            inventory={inventory}
            onUpdateSuccess={loadData}
          />
        )}

        {canManageInventory && activeTab === "custom-id" && (
          <CustomIdTab inventory={inventory} onUpdateSuccess={loadData} />
        )}

        {canManageInventory && activeTab === "fields" && (
          <CustomFieldsTab inventory={inventory} onUpdateSuccess={loadData} />
        )}

        {canManageInventory && activeTab === "access" && (
          <div>
            <h4>Access Management</h4>
            <div className="alert alert-secondary">
              User search autocomplete and permissions table goes here.
            </div>
          </div>
        )}

        {canManageInventory && activeTab === "stats" && (
          <StatisticsTab inventoryId={inventoryId!} />
        )}
      </div>

      {isAddModalOpen && inventoryId && (
        <AddItemModal
          inventoryId={inventoryId}
          customFields={inventory.customFields}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={handleAddItemSuccess}
        />
      )}

      {editingItem && inventory && (
        <EditItemModal
          item={editingItem}
          customFields={inventory.customFields}
          onClose={() => setEditingItem(null)}
          onSuccess={handleEditItemSuccess}
        />
      )}
    </div>
  );
}
