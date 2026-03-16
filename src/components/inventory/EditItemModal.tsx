import { useState, useEffect } from "react";
import { updateItem } from "../../services/inventoryItemService";
import type { InventoryItem } from "../../types/inventoryItem";
import type { InventoryCustomField } from "../../types/inventoryDetails";

interface Props {
  item: InventoryItem;
  customFields: InventoryCustomField[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditItemModal({
  item,
  customFields,
  onClose,
  onSuccess,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Record<string, string>>({});

  useEffect(() => {
    const initialData: Record<string, string> = {};

    customFields.forEach((field) => {
      initialData[field.id] = "";
    });

    item.customFieldValues?.forEach((cv) => {
      if (cv.inventoryCustomFieldId) {
        initialData[cv.inventoryCustomFieldId] = cv.value || "";
      }
    });

    setFormData(initialData);
  }, [item, customFields]);

  const handleChange = (fieldId: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const payload = Object.entries(formData).map(([fieldId, value]) => ({
        inventoryCustomFieldId: fieldId,
        value: value,
      }));

      await updateItem(item.id, payload);
      onSuccess();
    } catch (err: any) {
      console.error("Failed to update item:", err);
      setError("Failed to update the item. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="modal-backdrop fade show"></div>
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Item ({item.customId})</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>

            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}

              <form id="edit-item-form" onSubmit={handleSubmit}>
                {customFields.map((field) => {
                  const isBoolean = field.type === "Boolean";
                  const value = formData[field.id] || "";

                  return (
                    <div key={field.id} className="mb-3">
                      {isBoolean ? (
                        <div className="form-check mt-2">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id={`field-${field.id}`}
                            checked={value === "true"}
                            onChange={(e) =>
                              handleChange(
                                field.id,
                                e.target.checked ? "true" : "false",
                              )
                            }
                          />
                          <label
                            className="form-check-label fw-bold"
                            htmlFor={`field-${field.id}`}
                          >
                            {field.title}
                          </label>
                          {field.description && (
                            <div className="form-text">{field.description}</div>
                          )}
                        </div>
                      ) : (
                        <>
                          <label className="form-label fw-bold mb-1">
                            {field.title}
                          </label>
                          {field.type === "MultiLineText" ? (
                            <textarea
                              className="form-control"
                              rows={3}
                              value={value}
                              onChange={(e) =>
                                handleChange(field.id, e.target.value)
                              }
                            />
                          ) : (
                            <input
                              type={field.type === "Number" ? "number" : "text"}
                              className="form-control"
                              value={value}
                              onChange={(e) =>
                                handleChange(field.id, e.target.value)
                              }
                            />
                          )}
                          {field.description && (
                            <div className="form-text">{field.description}</div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </form>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                form="edit-item-form"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
