import { useState } from "react";
import { submitSupportTicket } from "../services/supportService";
import { useAuth } from "../context/AuthContext";
import { useSupportContext } from "../context/SupportContext";

export default function SupportWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [priority, setPriority] = useState("Average");
  const [summary, setSummary] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const { auth } = useAuth();
  const { currentInventoryTitle } = useSupportContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const currentLink = window.location.href;

      await submitSupportTicket(
        priority,
        summary,
        currentLink,
        currentInventoryTitle,
      );

      setStatusMessage({
        type: "success",
        text: "Ticket submitted successfully!",
      });
      setSummary("");

      setTimeout(() => {
        setIsOpen(false);
        setStatusMessage(null);
      }, 2000);
    } catch (error) {
      console.error("Failed to submit ticket:", error);
      setStatusMessage({
        type: "error",
        text: "Failed to submit ticket. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!auth) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="btn btn-primary rounded-circle shadow-lg position-fixed d-flex justify-content-center align-items-center"
        style={{
          bottom: "30px",
          right: "30px",
          width: "60px",
          height: "60px",
          zIndex: 1050,
        }}
        title="Create Support Ticket"
      >
        <span className="fs-3">?</span>
      </button>

      {isOpen && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-light">
                <h5 className="modal-title">Create Support Ticket</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsOpen(false)}
                ></button>
              </div>

              <div className="modal-body">
                {statusMessage && (
                  <div
                    className={`alert alert-${statusMessage.type === "success" ? "success" : "danger"}`}
                  >
                    {statusMessage.text}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Priority</label>
                    <select
                      className="form-select"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                    >
                      <option value="High">High</option>
                      <option value="Average">Average</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Summary</label>
                    <textarea
                      className="form-control"
                      rows={4}
                      placeholder="Describe the issue you are experiencing..."
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  {currentInventoryTitle && (
                    <p className="text-muted small mb-3">
                      Context: {currentInventoryTitle}
                    </p>
                  )}

                  <div className="d-flex justify-content-end">
                    <button
                      type="button"
                      className="btn btn-outline-secondary me-2"
                      onClick={() => setIsOpen(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isSubmitting || !summary.trim()}
                    >
                      {isSubmitting ? "Sending..." : "Submit Ticket"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
