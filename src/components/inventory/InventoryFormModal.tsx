import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import type { Category } from "../../types/category";
import { getCategories } from "../../services/categoryService";

const validationSchema = Yup.object({
  title: Yup.string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters"),
  description: Yup.string()
    .required("Description is required")
    .min(3, "Description must be at least 3 characters"),
  categoryId: Yup.string().required("Category is required"),
  imageUrl: Yup.string().nullable().optional(),
  tags: Yup.mixed().optional(),
  isPublic: Yup.boolean().default(false).required(),
});

interface Props {
  onSubmit: (data: any) => void | Promise<void>;
  initial?: any;
  onClose: () => void;
}

export default function InventoryFormModal({
  onSubmit,
  initial,
  onClose,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
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

            <form onSubmit={handleSubmit(submitHandler)}>
              <div className="modal-body">
                {/* Title Input */}
                <input
                  className={`form-control mb-2 ${errors.title ? "is-invalid" : ""}`}
                  placeholder="Title"
                  {...register("title")}
                />
                {errors.title && (
                  <div className="invalid-feedback mb-2">
                    {errors.title.message as string}
                  </div>
                )}

                {/* Description Input */}
                <textarea
                  className={`form-control mb-2 ${errors.description ? "is-invalid" : ""}`}
                  placeholder="Description"
                  {...register("description")}
                />
                {errors.description && (
                  <div className="invalid-feedback mb-2">
                    {errors.description.message as string}
                  </div>
                )}

                {/* Category Select */}
                <select
                  className={`form-select mb-2 ${errors.categoryId ? "is-invalid" : ""}`}
                  {...register("categoryId")}
                >
                  <option value="">Select a category...</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <div className="invalid-feedback mb-2">
                    {errors.categoryId.message as string}
                  </div>
                )}

                {/* Image URL Input */}
                <input
                  className="form-control mb-2"
                  placeholder="Image URL"
                  {...register("imageUrl")}
                />

                {/* Tags Input */}
                <input
                  className="form-control mb-2"
                  placeholder="Tags (comma separated)"
                  {...register("tags")}
                />

                {/* Public Checkbox */}
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
