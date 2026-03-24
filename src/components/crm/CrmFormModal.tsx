import { useState } from "react";
import { syncToSalesforce } from "../../services/crmService";

interface Props {
  onClose: () => void;
}

export default function CrmFormModal({ onClose }: Props) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    companyName: "",
    phone: "",
  });

  const [status, setStatus] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    try {
      await syncToSalesforce(formData);
      setStatus({ type: "success", text: "Successfully added to CRM!" });
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      setStatus({ type: "error", text: "Failed to sync with Salesforce." });
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-light">
            <h5 className="modal-title">Complete Your Profile (Join CRM)</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={isSubmitting}
            ></button>
          </div>

          <div className="modal-body">
            {status && (
              <div
                className={`alert alert-${status.type === "success" ? "success" : "danger"}`}
              >
                {status.text}
              </div>
            )}

            <p className="text-muted small mb-4">
              Join our mailing list to receive updates and exclusive offers!
            </p>

            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col">
                  <label className="form-label fw-semibold">First Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                  />
                </div>
                <div className="col">
                  <label className="form-label fw-semibold">Last Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Email Address *
                </label>
                <input
                  type="email"
                  className="form-control"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Company / Household Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. BTU Web Project"
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({ ...formData, companyName: e.target.value })
                  }
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Phone Number</label>
                <input
                  type="tel"
                  className="form-control"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>

              <div className="d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-outline-secondary me-2"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Syncing..." : "Submit to CRM"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
