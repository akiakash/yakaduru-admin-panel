"use client";
import React, { useState, useEffect } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { fetchCategories } from "@/controller/GalleryCategory/GalleryCategory";
import { uploadFiles } from "@/controller/uploadFile/uploadFile";
import { addGallery } from "@/controller/Gallery/Gallery";

export default function ManageGallery() {
  // State to store categories, loading status, and other form data
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Function to load categories
  const loadCategories = async () => {
    setLoading(true); // Set loading state to true before fetching data
    const response = await fetchCategories(); // Call the fetchCategories function

    if (response.success && response.data) {
      // Set the categories once data is fetched successfully
      setCategories(response.data as { id: string; name: string }[]);
    }

    setLoading(false); // Set loading state to false after fetching data
  };

  // Effect hook to load categories when the component mounts
  useEffect(() => {
    loadCategories();
  }, []); // Empty dependency array means this runs only once when the component mounts

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(event.target.files);
    }
  };

  // Handle form submit
  const handleSubmit = async () => {
    if (!title || !selectedCategory || !files) {
      console.error("All fields are required");
      return;
    }

    // Example of uploading files and creating gallery
    const uploadedFiles = await uploadFiles(Array.from(files));

    if (uploadedFiles.success) {
      const imageLinks = uploadedFiles.urls;

      const galleryData = {
        title,
        imageLinks,
        categoryId: selectedCategory,
      };

      // You can now call addGallery here with galleryData
      const galleryResponse = await addGallery(galleryData);

      if (galleryResponse.success) {
        console.log("Gallery added successfully!");
      } else {
        console.error("Failed to add gallery", galleryResponse.message);
      }
    } else {
      console.error("Failed to upload files", uploadedFiles.message);
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Manage Gallery" />

      <div className="flex w-full justify-center">
        <div className="flex w-full max-w-[720px] flex-col gap-9 rounded-[10px] bg-white p-10">
          {/* Title Input */}
          <input
            type="text"
            placeholder="Gallery Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mb-4 rounded border p-2"
          />

          {/* Dropdown for Categories */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="mb-4 rounded border p-2"
            disabled={loading} // Disable dropdown while loading categories
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          {/* File Upload */}
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="mb-4 rounded border p-2"
          />

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="rounded bg-blue-500 p-2 text-white"
          >
            Submit
          </button>
        </div>
      </div>
    </DefaultLayout>
  );
}
