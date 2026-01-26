import type { Category } from "./CategoriesPage";
import { useSnackbar } from "notistack";

interface Props {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: number) => void;
}

export default function CategoryList({ categories, onEdit, onDelete }: Props) {
  const { enqueueSnackbar } = useSnackbar(); 

  const handleDelete = (id: number) => {
    onDelete(id);

    enqueueSnackbar("Category deleted successfully!", { variant: "success" });
  };

  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {categories.map((cat) => (
        <li key={cat.id} style={{ marginBottom: 8 }}>
          {cat.name}
          <button
            style={{ marginLeft: 10 }}
            onClick={() => {
                onEdit(cat);
                enqueueSnackbar("Editing " + cat.name, { variant: "info" });
            }}
          >
            Edit
          </button>

          <button
            style={{ marginLeft: 5 }}
            onClick={() => handleDelete(cat.id)}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}