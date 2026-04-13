import { useEffect, useState } from "react";
import CategoryList from "./CategoryList";
import CategoryForm from "./CategoryForm";
import type { Category } from "../types/category";
import { CategoryService } from "../services/CategoryService";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      setLoading(true);
      const data = await CategoryService.getAll();
      setCategories(data);
    } catch (err: any) {
      setError(err.message || "Error loading categories");
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(name: string) {
    try {
      const created = await CategoryService.create({ name });
      setCategories((prev) => [...prev, created]);
    } catch (err: any) {
      alert(err.message);
    }
  }

  async function handleEdit(id: number, name: string) {
    try {
      const updated = await CategoryService.update(id, { name });
      setCategories((prev) =>
        prev.map((cat) => (cat.id === id ? updated : cat))
      );
      setEditingCategory(null);
    } catch (err: any) {
      alert(err.message);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this category?")) return;
    try {
      await CategoryService.remove(id);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Categories</h2>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

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
