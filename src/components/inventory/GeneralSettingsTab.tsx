import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { updateInventory } from "../../services/inventoryService";
import { getCategories } from "../../services/categoryService";
import type { Category } from "../../types/category";
import type { InventoryDetails } from "../../types/inventoryDetails";

interface Props {
  inventory: InventoryDetails;
  onUpdateSuccess: () => void;
}

interface GeneralSettingsFormData {
  title: string;
  description: string;
  categoryId: string;
  imageUrl?: string;
  isPublic: boolean;
  tags: string;
}

export default function GeneralSettingsTab({
  inventory,
  onUpdateSuccess,
}: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    register,
    watch,
    handleSubmit,
    reset,
    getValues,
    formState: { isDirty },
  } = useForm<GeneralSettingsFormData>({
    defaultValues: {
      title: inventory.title,
      description: inventory.description,
      categoryId: inventory.categoryId,
      imageUrl: inventory.imageUrl || "",
      isPublic: inventory.isPublic,
      tags: inventory.tags?.map((t) => t.name).join(", ") || "",
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const performSave = async (data: GeneralSettingsFormData) => {
    try {
      setSaveStatus("saving");
      setErrorMessage(null);

      const payload = {
        title: data.title,
        description: data.description,
        categoryId: data.categoryId,
        imageUrl: data.imageUrl,
        isPublic: data.isPublic,
        tags: data.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };

      await updateInventory(inventory.id, payload);

      reset(data);

      setSaveStatus("saved");
      onUpdateSuccess();
    } catch (error: any) {
      setSaveStatus("error");
      if (error.response?.status === 409) {
        setErrorMessage(
          "Conflict: Another user modified these settings. Please refresh.",
        );
      } else {
        setErrorMessage("Failed to save. Please check your connection.");
      }
      console.error("Save failed:", error);
    }
  };

  const formValues = watch();

  useEffect(() => {
    if (!isDirty) return;

    setSaveStatus("idle");

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(() => {
      performSave(getValues());
    }, 8000);

    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, [formValues, isDirty, getValues]);

  const handleManualSave = (data: GeneralSettingsFormData) => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    performSave(data);
  };

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0">General Settings</h4>
          <div className="d-flex align-items-center gap-3">
            {saveStatus === "saving" && (
              <span className="text-primary fw-bold">Saving changes...</span>
            )}
            {saveStatus === "saved" && (
              <span className="text-success fw-bold">All changes saved.</span>
            )}
            {saveStatus === "error" && (
              <span className="text-danger fw-bold">{errorMessage}</span>
            )}

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit(handleManualSave)}
              disabled={!isDirty || saveStatus === "saving"}
            >
              {saveStatus === "saving" ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        <p className="text-muted small">
          Changes are automatically saved 8 seconds after you stop typing, or
          you can save manually.
        </p>

        <form onSubmit={handleSubmit(handleManualSave)}>
          <div className="mb-3">
            <label className="form-label fw-bold">Title</label>
            <input className="form-control" {...register("title")} />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Description</label>
            <textarea
              className="form-control"
              rows={4}
              {...register("description")}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Category</label>
            <select className="form-select" {...register("categoryId")}>
              <option value="">Select a category...</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Image URL</label>
            <input className="form-control" {...register("imageUrl")} />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Tags</label>
            <input
              className="form-control"
              placeholder="e.g. electronics, laptop, office"
              {...register("tags")}
            />
            <div className="form-text">Separate tags with commas.</div>
          </div>

          <div className="form-check mb-3">
            <input
              type="checkbox"
              className="form-check-input"
              id="isPublicCheck"
              {...register("isPublic")}
            />
            <label className="form-check-label fw-bold" htmlFor="isPublicCheck">
              Public Inventory
            </label>
            <div className="form-text">
              If checked, all authenticated users can add items to this
              inventory.
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
