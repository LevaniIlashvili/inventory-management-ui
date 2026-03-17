import { useState } from "react";
import { useForm } from "react-hook-form";
import { addItem } from "../../services/inventoryItemService";
import type { InventoryCustomField } from "../../types/inventoryDetails";

interface Props {
  inventoryId: string;
  customFields: InventoryCustomField[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddItemModal({
  inventoryId,
  customFields,
  onClose,
  onSuccess,
}: Props) {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const submitHandler = async (data: any) => {
    setErrorMsg(null);

    try {
      const customFieldValues = customFields.map((field) => {
        const rawValue = data[field.id];

        let stringValue = null;
        if (rawValue !== undefined && rawValue !== null && rawValue !== "") {
          stringValue = String(rawValue);
        }

        return {
          inventoryCustomFieldId: field.id,
          value: stringValue,
        };
      });

      const payload = {
        inventoryId,
        customFieldValues,
      };

      await addItem(payload);
      onSuccess();
    } catch (error) {
      console.error("Error adding item:", error);
      setErrorMsg(
        "Failed to save the item. Please check your connection or try again.",
      );
    }
  };

  const renderFieldInput = (field: InventoryCustomField) => {
    const fieldType = field.type.toLowerCase();

    if (fieldType.includes("boolean") || fieldType.includes("checkbox")) {
      return (
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id={field.id}
            {...register(field.id)}
          />
          <label className="form-check-label" htmlFor={field.id}>
            {field.title}
          </label>
        </div>
      );
    }

    if (fieldType.includes("multiline") || fieldType.includes("textarea")) {
      return (
        <textarea
          className="form-control"
          id={field.id}
          rows={3}
          {...register(field.id)}
        />
      );
    }

    const inputType = fieldType.includes("number") ? "number" : "text";

    return (
      <input
        type={inputType}
        className="form-control"
        id={field.id}
        {...register(field.id)}
      />
    );
  };

  return (
    <div
      className="modal show d-block"
      tabIndex={-1}
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add New Item</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          <form onSubmit={handleSubmit(submitHandler)}>
            <div className="modal-body">
              {/* Renders the error notification if the API fails */}
              {errorMsg && (
                <div className="alert alert-danger py-2 mb-3" role="alert">
                  {errorMsg}
                </div>
              )}

              {customFields.map((field) => (
                <div className="mb-3" key={field.id}>
                  {!field.type.toLowerCase().includes("boolean") && (
                    <label
                      htmlFor={field.id}
                      className="form-label fw-semibold"
                    >
                      {field.title}
                    </label>
                  )}
                  {renderFieldInput(field)}
                </div>
              ))}

              {customFields.length === 0 && (
                <div className="alert alert-warning">
                  No custom fields defined for this inventory.
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Item"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
