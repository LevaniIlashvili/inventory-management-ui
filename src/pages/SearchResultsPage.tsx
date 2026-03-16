import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { Inventory } from "../types/inventory";
import {
  getInventoriesByTag,
  searchInventories,
} from "../services/inventoryService";
import ReadOnlyInventoryTable from "../components/inventory/ReadOnlyInventoryTable";

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState<Inventory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const query = searchParams.get("q");
  const tag = searchParams.get("tag");

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        if (query) {
          const data = await searchInventories(query);
          setResults(data);
        } else if (tag) {
          const data = await getInventoriesByTag(tag);
          setResults(data);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error("Failed to fetch search results:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query, tag]);

  const pageTitle = query
    ? `Search Results for "${query}"`
    : tag
      ? `Inventories tagged with "${tag}"`
      : "Search Inventories";

  return (
    <div className="container mt-5">
      <div className="row mb-4">
        <div className="col">
          <h2>{pageTitle}</h2>
          <p className="text-muted">
            {isLoading
              ? "Searching database..."
              : `Found ${results.length} result(s).`}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row">
          <div className="col-12">
            <ReadOnlyInventoryTable title="Results" inventories={results} />
          </div>
        </div>
      )}
    </div>
  );
}
