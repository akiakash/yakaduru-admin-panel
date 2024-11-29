"use client";
import React, { useState, useEffect } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { fetchCategories } from "@/controller/GalleryCategory/GalleryCategory";
import { uploadFiles } from "@/controller/uploadFile/uploadFile";
import {
  addGallery,
  fetchGalleries,
  editGallery,
  deleteGallery,
} from "@/controller/Gallery/Gallery";

export default function ManageGallery() {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [galleries, setGalleries] = useState<
    {
      id: string;
      title: string;
      imageLinks: string[];
      categoryId: string;
    }[]
  >([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [editingGalleryId, setEditingGalleryId] = useState<string | null>(null);

  const loadCategories = async () => {
    setLoading(true);
    const response = await fetchCategories();

    if (response.success && response.data) {
      setCategories(response.data as { id: string; name: string }[]);
    }

    setLoading(false);
  };

  const loadGalleries = async () => {
    const response = await fetchGalleries();
    if (response.success && response.galleries) {
      setGalleries(response.galleries);
    } else {
      console.error("Failed to fetch galleries:", response.message);
    }
  };

  useEffect(() => {
    loadCategories();
    loadGalleries();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(event.target.files);
    }
  };

  const handleSubmit = async () => {
    if (!title || !selectedCategory || !files) {
      console.error("All fields are required");
      return;
    }

    const uploadedFiles = await uploadFiles(Array.from(files));

    if (uploadedFiles.success) {
      const imageLinks = uploadedFiles.urls;

      const galleryData = {
        title,
        imageLinks,
        categoryId: selectedCategory,
      };

      const galleryResponse = await addGallery(galleryData);

      if (galleryResponse.success) {
        console.log("Gallery added successfully!");
        loadGalleries();
        alert("Gallery added successfully!");
      } else {
        console.error("Failed to add gallery", galleryResponse.message);
        alert("Failed to add gallery");
      }
    } else {
      console.error("Failed to upload files", uploadedFiles.message);
      alert("Failed to upload files");
    }
  };

  const handleDeleteGallery = async (id: string) => {
    const deleteResponse = await deleteGallery(id);

    if (deleteResponse.success) {
      console.log("Gallery deleted successfully!");
      loadGalleries();
      alert("Gallery deleted successfully!");
    } else {
      console.error("Failed to delete gallery", deleteResponse.message);
      alert("Failed to delete gallery");
    }
  };

  const handleRemoveImage = async (galleryId: string, imageLink: string) => {
    const gallery = galleries.find((g) => g.id === galleryId);
    if (gallery) {
      const updatedImageLinks = gallery.imageLinks.filter(
        (link) => link !== imageLink,
      );

      const updatedGalleryData = {
        ...gallery,
        imageLinks: updatedImageLinks,
      };

      const editResponse = await editGallery(galleryId, updatedGalleryData);

      if (editResponse.success) {
        console.log("Gallery image removed successfully!");
        loadGalleries();
        alert("Image removed successfully!");
      } else {
        console.error(
          "Failed to update gallery after image removal",
          editResponse.message,
        );
        alert("Failed to remove image");
      }
    }
  };

  const handleAddMoreImages = async (galleryId: string) => {
    if (!files) {
      console.error("No files selected for uploading more images");
      alert("No files selected for uploading more images");
      return;
    }

    const uploadedFiles = await uploadFiles(Array.from(files));

    if (uploadedFiles.success) {
      const newImageLinks = uploadedFiles.urls;

      const gallery = galleries.find((g) => g.id === galleryId);

      if (gallery) {
        const updatedImageLinks = [...gallery.imageLinks, ...newImageLinks];
        const updatedGalleryData = {
          ...gallery,
          imageLinks: updatedImageLinks,
        };

        const editResponse = await editGallery(galleryId, updatedGalleryData);

        if (editResponse.success) {
          console.log("More images added successfully!");
          loadGalleries();
          alert("More images added successfully!");
        } else {
          console.error(
            "Failed to update gallery with new images",
            editResponse.message,
          );
          alert("Failed to add more images");
        }
      }
    } else {
      console.error("Failed to upload files", uploadedFiles.message);
      alert("Failed to upload more images");
    }
  };

  const handleSaveChanges = async (galleryId: string) => {
    if (editingGalleryId !== galleryId) return;

    const updatedGallery = galleries.find((g) => g.id === galleryId);

    if (updatedGallery && files) {
      const uploadedFiles = await uploadFiles(Array.from(files));

      if (uploadedFiles.success) {
        const newImageLinks = [
          ...updatedGallery.imageLinks,
          ...uploadedFiles.urls,
        ];
        const updatedGalleryData = {
          ...updatedGallery,
          imageLinks: newImageLinks,
        };

        const editResponse = await editGallery(galleryId, updatedGalleryData);

        if (editResponse.success) {
          console.log("Gallery updated successfully!");
          loadGalleries();
          alert("Gallery updated successfully!");
        } else {
          console.error("Failed to update gallery", editResponse.message);
          alert("Failed to update gallery");
        }
      } else {
        console.error("Failed to upload files", uploadedFiles.message);
        alert("Failed to upload files");
      }
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
            disabled={loading}
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
            Add Gallery
          </button>
        </div>
      </div>

      {/* Display Galleries */}
      <div className="mt-10">
        <h2 className="mb-4 text-xl font-bold">Galleries</h2>
        {galleries.length === 0 ? (
          <p>No galleries available</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {galleries.map((gallery) => {
              // Find the category based on categoryId
              const category = categories.find(
                (cat) => cat.id === gallery.categoryId,
              );

              return (
                <div
                  key={gallery.id}
                  className="rounded bg-white p-4 shadow-md"
                >
                  <input
                    type="text"
                    value={gallery.title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mb-2 w-full rounded border p-2"
                  />
                  {/* Display Category ID and Name */}
                  {category && (
                    <p className="text-sm text-gray-500">
                      Category : {category.name}
                    </p>
                  )}

                  <div className="mb-4">
                    {gallery.imageLinks.map((link, index) => (
                      <div key={index} className="relative mb-2">
                        <img
                          src={link}
                          alt={`Gallery Image ${index + 1}`}
                          className="h-[320px] w-full object-cover"
                        />
                        <button
                          onClick={() => handleRemoveImage(gallery.id, link)}
                          className="absolute right-0 top-0 rounded-full bg-red-500 p-2 text-white"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add More Images */}
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="mb-4 rounded border p-2"
                  />
                  <button
                    onClick={() => handleAddMoreImages(gallery.id)}
                    className="rounded bg-blue-500 p-2 text-white"
                  >
                    Add More Images
                  </button>

                  {/* Save Changes Button */}
                  {/* <button
                    onClick={() => handleSaveChanges(gallery.id)}
                    className="mt-2 rounded bg-green-500 p-2 text-white"
                  >
                    Save Changes
                  </button> */}

                  {/* Delete Gallery */}
                  <button
                    onClick={() => handleDeleteGallery(gallery.id)}
                    className="mt-2 rounded bg-red-500 p-2 text-white"
                  >
                    Delete Gallery
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}
