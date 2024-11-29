"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { useEffect, useState } from "react";
import {
  addCategory,
  editCategory,
  deleteCategory,
  fetchCategories,
} from "../../../controller/GalleryCategory/GalleryCategory"; // Adjust the path as needed

export default function Page() {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [newCategory, setNewCategory] = useState<string>("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch Categories
  const loadCategories = async () => {
    setLoading(true);
    const response = await fetchCategories();
    if (response.success) {
      setCategories(response.data as { id: string; name: string }[]);
    }
    setLoading(false);
  };

  // Add Category
  const handleAddCategory = async () => {
    if (newCategory.trim()) {
      const response = await addCategory({ name: newCategory.trim() });
      if (response.success) {
        setCategories((prev) => [
          ...prev,
          response.data as { id: string; name: string },
        ]);
        setNewCategory("");
      }
    }
  };

  // Edit Category
  const handleSaveEdit = async () => {
    if (editingIndex !== null && editingValue.trim()) {
      const category = categories[editingIndex];
      const response = await editCategory(category.id, {
        name: editingValue.trim(),
      });
      if (response.success) {
        const updatedCategories = [...categories];
        updatedCategories[editingIndex].name = editingValue.trim();
        setCategories(updatedCategories);
        setEditingIndex(null);
        setEditingValue("");
      }
    }
  };

  // Delete Category
  const handleDeleteCategory = async (id: string) => {
    const response = await deleteCategory(id);
    if (response.success) {
      setCategories(categories.filter((category) => category.id !== id));
    }
  };

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div>
      <DefaultLayout>
        <Breadcrumb pageName="Manage Gallery Category" />

        <div className="flex w-full justify-center">
          <div className="flex w-full max-w-[720px] flex-col gap-9 rounded-[10px] bg-white p-10">
            {/* Add Category */}
            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Add Category
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Category Name"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
                <button
                  onClick={handleAddCategory}
                  className="hover:bg-primary-dark rounded-lg bg-primary px-5 py-3 text-white"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Category List */}
            <div>
              <h3 className="mb-3 text-lg font-medium text-black dark:text-white">
                Categories
              </h3>
              {loading ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Loading categories...
                </p>
              ) : (
                <ul className="space-y-3">
                  {categories.map((category, index) => (
                    <li
                      key={category.id}
                      className="flex items-center justify-between rounded-lg border border-stroke px-5 py-3 dark:border-form-strokedark"
                    >
                      {editingIndex === index ? (
                        <div className="flex w-full items-center gap-3">
                          <input
                            type="text"
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-3 py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          />
                          <button
                            onClick={handleSaveEdit}
                            className="hover:bg-primary-dark rounded-lg bg-primary px-3 py-2 text-white"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingIndex(null);
                              setEditingValue("");
                            }}
                            className="rounded-lg bg-gray-300 px-3 py-2 text-black hover:bg-gray-400"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="text-black dark:text-white">
                            {category.name}
                          </span>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => {
                                setEditingIndex(index);
                                setEditingValue(category.name);
                              }}
                              className="rounded-lg bg-blue-500 px-3 py-2 text-white hover:bg-blue-600"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(category.id)}
                              className="rounded-lg bg-red-500 px-3 py-2 text-white hover:bg-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              )}
              {categories.length === 0 && !loading && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No categories added yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </DefaultLayout>
    </div>
  );
}
