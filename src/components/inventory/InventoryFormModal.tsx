import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { Category } from "../../types/category";
import { getCategories } from "../../services/categoryService";

interface InventoryFormData {
  title: string;
  description: string;
  categoryId: string;
  imageUrl?: string;
  isPublic: boolean;
  tags: string[];
}

interface Props {
  onSubmit: (data: any) => void | Promise<void>;
  initial?: any;
  onClose: () => void; // Added strictly to close the modal
}

export default function InventoryFormModal({
  onSubmit,
  initial,
  onClose,
}: Props) {
  // YOUR EXACT WORKING LOGIC:
  const { register, handleSubmit } = useForm<InventoryFormData>({
    defaultValues: initial,
  });

  const [categories, setCategories] = useState<Category[]>([]);

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

  const submitHandler = (data: any) => {
    const formatted = {
      ...data,
      tags:
        typeof data.tags === "string"
          ? data.tags
              .split(",")
              .map((t: string) => t.trim())
              .filter(Boolean)
          : [],
    };

    onSubmit(formatted);
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
              <h5 className="modal-title">
                {initial ? "Edit Inventory" : "Create Inventory"}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>

            {/* YOUR EXACT FORM INPUTS WRAPPED IN A MODAL BODY */}
            <form onSubmit={handleSubmit(submitHandler)}>
              <div className="modal-body">
                <input
                  className="form-control mb-2"
                  placeholder="Title"
                  {...register("title")}
                />
                <textarea
                  className="form-control mb-2"
                  placeholder="Description"
                  {...register("description")}
                />
                <select
                  className="form-select mb-2"
                  {...register("categoryId", { required: true })}
                >
                  <option value="">Select a category...</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <input
                  className="form-control mb-2"
                  placeholder="Image URL"
                  {...register("imageUrl")}
                />
                <input
                  className="form-control mb-2"
                  placeholder="Tags (comma separated)"
                  {...register("tags")}
                />
                <div className="form-check mb-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    {...register("isPublic")}
                    id="isPublicCheck"
                  />
                  <label className="form-check-label" htmlFor="isPublicCheck">
                    Public
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
