import { useEffect, useState } from "react";
import {
  getLatestInventories,
  getPopularInventories,
} from "../services/inventoryService";
import type { Inventory } from "../types/inventory";
import ReadOnlyInventoryTable from "../components/inventory/ReadOnlyInventoryTable";

export default function MainPage() {
  const [latestInventories, setLatestInventories] = useState<Inventory[]>([]);
  const [popularInventories, setPopularInventories] = useState<Inventory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const [latestData, popularData] = await Promise.all([
          getLatestInventories(),
          getPopularInventories(),
        ]);

        setLatestInventories(latestData);
        setPopularInventories(popularData);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col">
          <h2>Welcome to MyApp</h2>
          <p className="text-muted">
            Explore the latest and most popular public inventories.
          </p>
        </div>
      </div>

      <div className="row">
        <div className="col-12 mb-4">
          <ReadOnlyInventoryTable
            title="Latest Inventories"
            inventories={latestInventories}
          />
        </div>

        <div className="col-12">
          <ReadOnlyInventoryTable
            title="Most Popular Inventories"
            inventories={popularInventories}
          />
        </div>
      </div>
    </div>
  );
}
