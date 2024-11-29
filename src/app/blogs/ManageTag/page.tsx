"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { useEffect, useState } from "react";
import {
  addTag,
  editTag,
  deleteTag,
  fetchTags,
} from "../../../controller/Tags/Tags"; // Adjust the path as needed

export default function Page() {
  const [tags, setTags] = useState<{ id: string; name: string }[]>([]);
  const [newTag, setNewTag] = useState<string>("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch Tags
  const loadTags = async () => {
    setLoading(true);
    const response = await fetchTags();
    if (response.success) {
      setTags(response.data as { id: string; name: string }[]);
    }
    setLoading(false);
  };

  // Add Tag
  const handleAddTag = async () => {
    if (newTag.trim()) {
      const response = await addTag({ name: newTag.trim() });
      if (response.success) {
        setTags((prev) => [
          ...prev,
          response.data as { id: string; name: string },
        ]);
        setNewTag("");
      }
    }
  };

  // Edit Tag
  const handleSaveEdit = async () => {
    if (editingIndex !== null && editingValue.trim()) {
      const tag = tags[editingIndex];
      const response = await editTag(tag.id, {
        name: editingValue.trim(),
      });
      if (response.success) {
        const updatedTags = [...tags];
        updatedTags[editingIndex].name = editingValue.trim();
        setTags(updatedTags);
        setEditingIndex(null);
        setEditingValue("");
      }
    }
  };

  // Delete Tag
  const handleDeleteTag = async (id: string) => {
    const response = await deleteTag(id);
    if (response.success) {
      setTags(tags.filter((tag) => tag.id !== id));
    }
  };

  // Load tags on mount
  useEffect(() => {
    loadTags();
  }, []);

  return (
    <div>
      <DefaultLayout>
        <Breadcrumb pageName="Manage Tags" />

        <div className="flex w-full justify-center">
          <div className="flex w-full max-w-[720px] flex-col gap-9 rounded-[10px] bg-white p-10">
            {/* Add Tag */}
            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Add Tag
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Tag Name"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
                <button
                  onClick={handleAddTag}
                  className="hover:bg-primary-dark rounded-lg bg-primary px-5 py-3 text-white"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Tag List */}
            <div>
              <h3 className="mb-3 text-lg font-medium text-black dark:text-white">
                Tags
              </h3>
              {loading ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Loading tags...
                </p>
              ) : (
                <ul className="space-y-3">
                  {tags.map((tag, index) => (
                    <li
                      key={tag.id}
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
                            {tag.name}
                          </span>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => {
                                setEditingIndex(index);
                                setEditingValue(tag.name);
                              }}
                              className="rounded-lg bg-blue-500 px-3 py-2 text-white hover:bg-blue-600"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteTag(tag.id)}
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
              {tags.length === 0 && !loading && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No tags added yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </DefaultLayout>
    </div>
  );
}
