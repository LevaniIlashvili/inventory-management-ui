import { useForm } from "react-hook-form";

interface InventoryFormData {
  title: string;
  description: string;
  categoryId: string;
  imageUrl?: string;
  isPublic: boolean;
  tags: string[];
}

interface Props {
  onSubmit: (data: InventoryFormData) => void | Promise<void>;
  initial?: InventoryFormData;
}

export default function InventoryFormModal({ onSubmit, initial }: Props) {
  const { register, handleSubmit } = useForm<InventoryFormData>({
    defaultValues: initial,
  });

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
    <form onSubmit={handleSubmit(submitHandler)} className="mb-3">
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

      <input
        className="form-control mb-2"
        placeholder="Category Id"
        {...register("categoryId")}
      />

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
        />
        <label className="form-check-label">Public</label>
      </div>

      <button className="btn btn-primary">Save</button>
    </form>
  );
}
