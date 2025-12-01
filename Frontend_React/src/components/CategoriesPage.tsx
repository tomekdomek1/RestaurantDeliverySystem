import { useState } from "react";
import CategoryList from "./CategoryList";
import CategoryForm from "./CategoryForm";

export interface Category {
  id: number;
  name: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: "Work" },
    { id: 2, name: "Home" },
  ]);

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleAdd = (name: string) => {
    setCategories((prev) => [
      ...prev,
      { id: Date.now(), name },
    ]);
  };

  const handleEdit = (id: number, name: string) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, name } : cat))
    );
    setEditingCategory(null);
  };

  const handleDelete = (id: number) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Categories</h2>

      <CategoryList
        categories={categories}
        onEdit={setEditingCategory}
        onDelete={handleDelete}
      />

      <h3>{editingCategory ? "Edit category" : "Add category"}</h3>

      <CategoryForm
        initialValue={editingCategory?.name || ""}
        onSubmit={(name) =>
          editingCategory
            ? handleEdit(editingCategory.id, name)
            : handleAdd(name)
        }
        onCancel={() => setEditingCategory(null)}
      />
    </div>
  );
}
