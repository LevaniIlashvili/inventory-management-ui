import { useState, useEffect } from "react";
import {
  addCustomIdElement,
  updateCustomIdElement,
  deleteCustomIdElements,
  type CustomIdElement,
} from "../../services/customIdService";
import type { InventoryDetails } from "../../types/inventoryDetails";

interface Props {
  inventory: InventoryDetails;
  onUpdateSuccess: () => void;
}

const ELEMENT_TYPES = [
  "FixedText",
  "Random20Bit",
  "Random32Bit",
  "Random6Digit",
  "Random9Digit",
  "Guid",
  "DateTime",
  "Sequence",
];

export default function CustomIdTab({ inventory, onUpdateSuccess }: Props) {
  const [elements, setElements] = useState<CustomIdElement[]>([]);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    const loaded = [...(inventory.customIdElements || [])].sort(
      (a, b) => a.order - b.order,
    );
    setElements(loaded);
    setDeletedIds([]);
  }, [inventory]);

  const generatePreview = () => {
    if (elements.length === 0)
      return "No format defined (Defaults to Sequence)";

    return elements
      .map((el) => {
        const type = String(el.type).toLowerCase();
        if (type.includes("fixedtext")) return el.fixedText || "";
        if (type.includes("20bit")) return "1048575";
        if (type.includes("32bit")) return "2147483647";
        if (type.includes("6digit")) return "123456";
        if (type.includes("9digit")) return "123456789";
        if (type.includes("guid")) return "a1b2c3d4-e5f6-...";
        if (type.includes("datetime")) {
          return el.format ? "20260313" : "20260313";
        }
        if (type.includes("sequence")) {
          return el.format ? "0001" : "1";
        }
        return "";
      })
      .join("");
  };

  const handleAddElement = (type: string) => {
    const newElement: CustomIdElement = {
      type,
      order: elements.length,
      fixedText: type === "FixedText" ? "-" : "",
      format: type === "Sequence" || type === "DateTime" ? "" : "",
    };
    setElements([...elements, newElement]);
  };

  const handleRemoveElement = (index: number) => {
    const el = elements[index];
    if (el.id) {
      setDeletedIds([...deletedIds, el.id]);
    }
    const updated = elements.filter((_, i) => i !== index);
    setElements(updated.map((item, i) => ({ ...item, order: i })));
  };

  const handleUpdateElement = (
    index: number,
    field: keyof CustomIdElement,
    value: any,
  ) => {
    const updated = [...elements];
    updated[index] = { ...updated[index], [field]: value };
    setElements(updated);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const updated = [...elements];
    const draggedEl = updated[draggedIndex];
    updated.splice(draggedIndex, 1);
    updated.splice(index, 0, draggedEl);

    const reordered = updated.map((item, i) => ({ ...item, order: i }));
    setElements(reordered);
    setDraggedIndex(index);
  };

  const handleDrop = () => {
    setDraggedIndex(null);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      if (deletedIds.length > 0) {
        await deleteCustomIdElements(inventory.id, deletedIds);
      }

      for (const el of elements) {
        const payload = {
          type: el.type,
          order: el.order,
          fixedText: el.fixedText,
          format: el.format,
        };

        if (el.id) {
          await updateCustomIdElement(inventory.id, el.id, payload);
        } else {
          await addCustomIdElement(inventory.id, payload);
        }
      }

      setDeletedIds([]);
      onUpdateSuccess();
      alert("Custom ID Format saved successfully!");
    } catch (error) {
      console.error("Failed to save custom ID elements", error);
      alert("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0">Custom ID Format</h4>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        <div className="alert alert-dark text-center fs-4 font-monospace mb-4">
          {generatePreview()}
        </div>

        <div className="row">
          <div className="col-md-8">
            <h6 className="text-muted mb-3">
              Drag to reorder. Configure properties below.
            </h6>

            {elements.length === 0 && (
              <div className="text-center p-4 border rounded bg-light">
                <p className="text-muted mb-0">
                  No elements added yet. Select one from the right.
                </p>
              </div>
            )}

            <div className="list-group">
              {elements.map((el, index) => (
                <div
                  key={el.id || `new-${index}`}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDrop}
                  className={`list-group-item d-flex align-items-start gap-3 ${
                    draggedIndex === index ? "bg-light border-primary" : ""
                  }`}
                  style={{ cursor: "grab" }}
                >
                  <div className="mt-2 text-muted" title="Drag to reorder">
                    ☰
                  </div>

                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between">
                      <strong className="mb-2 d-block">{el.type}</strong>
                      <button
                        className="btn btn-sm btn-outline-danger border-0"
                        onClick={() => handleRemoveElement(index)}
                        title="Remove element"
                      >
                        ✕
                      </button>
                    </div>

                    {String(el.type).toLowerCase().includes("fixedtext") && (
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="e.g. INV-"
                        value={el.fixedText || ""}
                        onChange={(e) =>
                          handleUpdateElement(
                            index,
                            "fixedText",
                            e.target.value,
                          )
                        }
                      />
                    )}

                    {(String(el.type).toLowerCase().includes("datetime") ||
                      String(el.type).toLowerCase().includes("sequence")) && (
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Optional format (e.g. yyyyMMdd or 0000)"
                        value={el.format || ""}
                        onChange={(e) =>
                          handleUpdateElement(index, "format", e.target.value)
                        }
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-md-4">
            <h6 className="text-muted mb-3">Add Element</h6>
            <div className="d-flex flex-column gap-2">
              {ELEMENT_TYPES.map((type) => (
                <button
                  key={type}
                  className="btn btn-outline-secondary text-start btn-sm"
                  onClick={() => handleAddElement(type)}
                >
                  + {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
