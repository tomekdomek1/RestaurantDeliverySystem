import type { Category } from "./CategoriesPage";

interface Props {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: number) => void;
}

export default function CategoryList({ categories, onEdit, onDelete }: Props) {
  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {categories.map((cat) => (
        <li key={cat.id} style={{ marginBottom: 8 }}>
          {cat.name}

          <button
            style={{ marginLeft: 10 }}
            onClick={() => onEdit(cat)}
          >
            Edit
          </button>

          <button
            style={{ marginLeft: 5 }}
            onClick={() => onDelete(cat.id)}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
