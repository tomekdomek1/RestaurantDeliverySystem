import { useState, useEffect } from "react";
import { TextField, Button, Stack } from "@mui/material";
interface Props {
  initialValue: string;
  onSubmit: (name: string) => void;
  onCancel: () => void;
}

export default function CategoryForm({ initialValue, onSubmit}: Props) {
  const [name, setName] = useState<string>("");

  useEffect(() => {
    setName(initialValue);
  }, [initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit(name);
    setName("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack direction="row" spacing={2} alignItems="center">
        <TextField
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category name"
          label="Category"
          variant="outlined"
          size="small"
          autoFocus
        />
        <Button type="submit" variant="contained" color="primary">
          Save
        </Button>

      </Stack>
    </form>
  );
}
