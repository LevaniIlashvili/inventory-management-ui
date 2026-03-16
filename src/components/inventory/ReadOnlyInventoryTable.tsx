import { useNavigate } from "react-router-dom";
import type { Inventory } from "../../types/inventory";

interface Props {
  title: string;
  inventories: Inventory[];
}

export default function ReadOnlyInventoryTable({ title, inventories }: Props) {
  const navigate = useNavigate();

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-white">
        <h5 className="mb-0">{title}</h5>
      </div>
      <div className="table-responsive">
        <table className="table table-hover mb-0">
          <thead className="table-light">
            <tr>
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
                <td className="fw-semibold">{inv.title}</td>
                <td
                  className="text-muted text-truncate"
                  style={{ maxWidth: "200px" }}
                >
                  {inv.description || "No description"}
                </td>
                <td>
                  {inv.isPublic ? (
                    <span className="badge bg-success">Yes</span>
                  ) : (
                    <span className="badge bg-secondary">No</span>
                  )}
                </td>
              </tr>
            ))}

            {inventories.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center text-muted py-4">
                  No inventories available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
