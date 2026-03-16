import { useState, useEffect } from "react";
import {
  addCustomField,
  updateCustomField,
  deleteCustomFields,
} from "../../services/customFieldService";
import type {
  InventoryDetails,
  InventoryCustomField,
} from "../../types/inventoryDetails";

interface Props {
  inventory: InventoryDetails;
  onUpdateSuccess: () => void;
}

const FIELD_TYPES = [
  { value: "SingleLineText", label: "Single-line Text" },
  { value: "MultiLineText", label: "Multi-line Text" },
  { value: "Number", label: "Number" },
  { value: "Boolean", label: "True/False (Checkbox)" },
  { value: "DocumentLink", label: "Document/Image Link" },
];

export default function CustomFieldsTab({ inventory, onUpdateSuccess }: Props) {
  const [fields, setFields] = useState<Partial<InventoryCustomField>[]>([]);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);

  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "danger";
    text: string;
  } | null>(null);

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    const loaded = [...(inventory.customFields || [])].sort(
      (a, b) => (a.order || 0) - (b.order || 0),
    );
    setFields(loaded);
    setDeletedIds([]);
    setStatusMessage(null);
  }, [inventory]);

  const handleAddField = (type: string) => {
    const newField: Partial<InventoryCustomField> = {
      type,
      order: fields.length,
      title: "",
      description: "",
      shouldBeDisplayed: true,
    };
    setFields([...fields, newField]);
    setStatusMessage(null);
  };

  const handleRemoveField = (index: number) => {
    const f = fields[index];
    if (f.id) {
      setDeletedIds([...deletedIds, f.id]);
    }
    const updated = fields.filter((_, i) => i !== index);
    setFields(updated.map((item, i) => ({ ...item, order: i })));
    setStatusMessage(null);
  };

  const handleUpdateField = (
    index: number,
    key: keyof InventoryCustomField,
    value: any,
  ) => {
    const updated = [...fields];
    updated[index] = { ...updated[index], [key]: value };
    setFields(updated);
    setStatusMessage(null);
  };

  const handleDragStart = (index: number) => setDraggedIndex(index);

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const updated = [...fields];
    const draggedEl = updated[draggedIndex];
    updated.splice(draggedIndex, 1);
    updated.splice(index, 0, draggedEl);

    setFields(updated.map((item, i) => ({ ...item, order: i })));
    setDraggedIndex(index);
  };

  const handleDrop = () => setDraggedIndex(null);

  const handleSave = async () => {
    if (fields.some((f) => !f.title || f.title.trim() === "")) {
      setStatusMessage({
        type: "danger",
        text: "All fields must have a title before saving.",
      });
      return;
    }

    try {
      setIsSaving(true);
      setStatusMessage(null);

      if (deletedIds.length > 0) {
        await deleteCustomFields(inventory.id, deletedIds);
      }

      for (const f of fields) {
        const payload = {
          title: f.title,
          description: f.description,
          shouldBeDisplayed: f.shouldBeDisplayed,
          type: f.type,
          order: f.order,
        };

        if (f.id) {
          await updateCustomField(inventory.id, f.id, payload);
        } else {
          await addCustomField(inventory.id, payload);
        }
      }

      setStatusMessage({
        type: "success",
        text: "Custom fields saved successfully!",
      });
      setDeletedIds([]);
      onUpdateSuccess();
    } catch (error) {
      console.error("Failed to save custom fields", error);
      setStatusMessage({
        type: "danger",
        text: "Failed to save changes. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const countType = (typeValue: string) =>
    fields.filter((f) => f.type === typeValue).length;

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0">Custom Fields</h4>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {statusMessage && (
          <div
            className={`alert alert-${statusMessage.type} alert-dismissible fade show`}
            role="alert"
          >
            {statusMessage.text}
            <button
              type="button"
              className="btn-close"
              onClick={() => setStatusMessage(null)}
            ></button>
          </div>
        )}

        <div className="row">
          <div className="col-md-8">
            <h6 className="text-muted mb-3">
              Drag to reorder. Define field properties below.
            </h6>

            {fields.length === 0 && (
              <div className="text-center p-4 border rounded bg-light">
                <p className="text-muted mb-0">
                  No custom fields defined. Add one from the panel.
                </p>
              </div>
            )}

            <div className="list-group">
              {fields.map((field, index) => (
                <div
                  key={field.id || `new-${index}`}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDrop}
                  className={`list-group-item d-flex align-items-start gap-3 p-3 ${
                    draggedIndex === index ? "bg-light border-primary" : ""
                  }`}
                  style={{ cursor: "grab" }}
                >
                  <div className="mt-2 text-muted" title="Drag to reorder">
                    ☰
                  </div>

                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="badge bg-secondary">{field.type}</span>
                      <button
                        className="btn btn-sm text-danger border-0 p-0"
                        onClick={() => handleRemoveField(index)}
                        title="Remove field"
                      >
                        ✕ Remove
                      </button>
                    </div>

                    <div className="row g-2 mb-2">
                      <div className="col-sm-6">
                        <label className="form-label small fw-bold mb-1">
                          Title <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="e.g. Serial Number"
                          value={field.title || ""}
                          onChange={(e) =>
                            handleUpdateField(index, "title", e.target.value)
                          }
                        />
                      </div>
                      <div className="col-sm-6">
                        <label className="form-label small fw-bold mb-1">
                          Description (Tooltip)
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Optional hint for users"
                          value={field.description || ""}
                          onChange={(e) =>
                            handleUpdateField(
                              index,
                              "description",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </div>

                    <div className="form-check mt-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`display-check-${index}`}
                        checked={field.shouldBeDisplayed || false}
                        onChange={(e) =>
                          handleUpdateField(
                            index,
                            "shouldBeDisplayed",
                            e.target.checked,
                          )
                        }
                      />
                      <label
                        className="form-check-label small"
                        htmlFor={`display-check-${index}`}
                      >
                        Display this field in the inventory items table
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-md-4">
            <h6 className="text-muted mb-3">Add Field Type</h6>
            <div className="d-flex flex-column gap-2">
              {FIELD_TYPES.map((typeObj) => {
                const currentCount = countType(typeObj.value);
                const isAtLimit = currentCount >= 3;

                return (
                  <button
                    key={typeObj.value}
                    className="btn btn-outline-secondary text-start btn-sm d-flex justify-content-between align-items-center"
                    onClick={() => handleAddField(typeObj.value)}
                    disabled={isAtLimit}
                    title={
                      isAtLimit
                        ? "Maximum of 3 fields reached for this type"
                        : ""
                    }
                  >
                    <span>+ {typeObj.label}</span>
                    <span className="badge bg-light text-dark">
                      {currentCount}/3
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="mt-3 form-text text-muted small">
              You can add up to 3 fields of each type according to system
              limits.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
