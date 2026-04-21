import type { Category } from "../types/category";

const BASE = "http://localhost:3000"; 
async function handleResponse(res: Response) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const CategoryService = {
  async getAll(): Promise<Category[]> {
    const res = await fetch(`${BASE}/categories`);
    return handleResponse(res);
  },

  async create(payload: Omit<Category, "id">): Promise<Category> {
    const res = await fetch(`${BASE}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  async update(id: string | number, payload: Partial<Category>): Promise<Category> {
    const res = await fetch(`${BASE}/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  async remove(id: string | number): Promise<void> {
    const res = await fetch(`${BASE}/categories/${id}`, {
      method: "DELETE",
    });
    return handleResponse(res);
  },
};
