import { useEffect, useState } from "react";
import { getInventoryStatistics } from "../../services/inventoryService";
import type { InventoryStatistics } from "../../types/inventory";

interface Props {
  inventoryId: string;
}

export default function StatisticsTab({ inventoryId }: Props) {
  const [stats, setStats] = useState<InventoryStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getInventoryStatistics(inventoryId);
        setStats(data);
      } catch (err) {
        console.error("Failed to load statistics:", err);
        setError("Failed to load inventory statistics.");
      } finally {
        setIsLoading(false);
      }
    };

    if (inventoryId) {
      fetchStats();
    }
  }, [inventoryId]);

  if (isLoading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading statistics...</span>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="alert alert-danger">{error || "No data available."}</div>
    );
  }

  return (
    <div className="container-fluid p-0">
      {/* Total Items Hero Card */}
      <div className="card shadow-sm border-primary mb-4">
        <div className="card-body text-center py-4">
          <h5 className="text-muted text-uppercase fw-bold mb-1">
            Total Inventory Items
          </h5>
          <h1 className="display-4 text-primary fw-bold mb-0">
            {stats.totalItems}
          </h1>
        </div>
      </div>

      <div className="row g-4">
        {/* Numeric Fields Aggregates */}
        {stats.numericFields.map((field) => (
          <div className="col-md-6" key={field.fieldId}>
            <div className="card shadow-sm h-100">
              <div className="card-header bg-light">
                <h6 className="mb-0 fw-bold">{field.fieldName} (Numeric)</h6>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between mb-2 pb-2 border-bottom">
                  <span className="text-muted">Minimum:</span>
                  <span className="fw-bold">{field.min}</span>
                </div>
                <div className="d-flex justify-content-between mb-2 pb-2 border-bottom">
                  <span className="text-muted">Average:</span>
                  <span className="fw-bold text-primary">{field.average}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Maximum:</span>
                  <span className="fw-bold">{field.max}</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {stats.stringFields.map((field) => {
          const entries = Object.entries(field.topValues);
          const maxCount = Math.max(...entries.map(([, count]) => count), 1);

          return (
            <div className="col-md-6" key={field.fieldId}>
              <div className="card shadow-sm h-100">
                <div className="card-header bg-light">
                  <h6 className="mb-0 fw-bold">
                    {field.fieldName} (Top Values)
                  </h6>
                </div>
                <div className="card-body">
                  {entries.length === 0 ? (
                    <p className="text-muted mb-0">No data recorded yet.</p>
                  ) : (
                    entries.map(([val, count]) => {
                      const percentage = Math.round((count / maxCount) * 100);
                      return (
                        <div key={val} className="mb-3">
                          <div className="d-flex justify-content-between mb-1 small">
                            <span
                              className="fw-semibold text-truncate pe-2"
                              style={{ maxWidth: "80%" }}
                            >
                              {val}
                            </span>
                            <span className="text-muted">{count} items</span>
                          </div>
                          <div className="progress" style={{ height: "8px" }}>
                            <div
                              className="progress-bar bg-info"
                              role="progressbar"
                              style={{ width: `${percentage}%` }}
                              aria-valuenow={percentage}
                              aria-valuemin={0}
                              aria-valuemax={100}
                            ></div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {stats.numericFields.length === 0 &&
        stats.stringFields.length === 0 &&
        stats.totalItems > 0 && (
          <div className="alert alert-secondary mt-4">
            No aggregate statistics available. Ensure you have custom fields
            defined as "Number" or "Single-line Text".
          </div>
        )}
    </div>
  );
}
