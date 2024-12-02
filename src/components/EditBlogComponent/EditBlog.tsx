import CategoryMultiSelect from "@/app/blogs/ManageCategory/EditCategoryMultiSelect";
import TagsMultiSelect from "@/app/blogs/ManageCategory/EditTagsMultiSelect";
import React, { useState, useEffect } from "react";
// import EditorBlog from "./EditorBlog";

const EditorBlog = dynamic(() => import("./EditorBlog"), { ssr: false });

import "react-quill/dist/quill.snow.css";
import { uploadFiles } from "@/controller/uploadFile/uploadFile";
import dynamic from "next/dynamic";

interface EditBlogModalProps {
  blog: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedBlog: any) => void;
}

const EditBlogModal: React.FC<EditBlogModalProps> = ({
  blog,
  isOpen,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState(blog?.title || "");
  const [description, setDescription] = useState(blog?.description || "");
  const [categories, setCategories] = useState(blog?.categories || []);
  const [tags, setTags] = useState(blog?.tags || []);
  const [author, setAuthor] = useState(blog?.author || "");
  const [content, setContent] = useState(blog?.content || "");
  const [featureImage, setFeatureImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setTitle(blog?.title || "");
      setCategories(blog?.categories || []);
      setTags(blog?.tags || []);
      setAuthor(blog?.author || "");
      setContent(blog?.content || "");
      setFeatureImage(null); // Reset image when modal opens
    }
  }, [isOpen, blog]);

  const handleEditorChange = (value: string) => {
    setContent(value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFeatureImage(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    let featureImageUrl = "";

    if (featureImage) {
      const uploadResponse = await uploadFiles([featureImage]);
      if (uploadResponse.success && uploadResponse.urls.length > 0) {
        featureImageUrl = uploadResponse.urls[0];
      } else {
        alert("Failed to upload the feature image. Please try again.");
        setIsSubmitting(false);
        return;
      }
    }

    const updatedBlog = {
      id: blog?.id,
      title,
      description,
      categories,
      tags,
      author,
      content,
      featureImage: featureImageUrl,
    };
    onSave(updatedBlog);
    onClose(); // Close the modal after saving
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-9999  flex items-center justify-center  bg-gray-500 bg-opacity-50">
      <div className="h-[700px] w-full max-w-[720px] overflow-y-auto rounded-lg bg-white p-8">
        <div className="flex w-full justify-between">
          <h3 className="mb-4 text-xl font-semibold">Edit Blog</h3>{" "}
          <h3 className="cursor-pointer font-bold" onClick={onClose}>
            Close
          </h3>
        </div>
        <div>
          <label className="mb-3 block text-sm font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter Title"
            className="w-full rounded-lg border px-5 py-3"
          />
        </div>
        <div>
          <label className="mb-3 block text-sm font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter Title"
            className="w-full rounded-lg border px-5 py-3"
          />
        </div>

        <div className="mt-4">
          <CategoryMultiSelect
            id="categories"
            selectedCategories={categories}
            onSelect={setCategories}
          />
        </div>

        <div className="mt-4">
          <TagsMultiSelect id="tags" selectedTags={tags} onSelect={setTags} />
        </div>

        <div className="mt-4">
          <label className="mb-3 block text-sm font-medium">Author</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Enter Author Name"
            className="w-full rounded-lg border px-5 py-3"
          />
        </div>

        <div className="mt-4">
          <label className="mb-3 block text-sm font-medium">Content</label>
          <EditorBlog value={content} onChange={handleEditorChange} />
        </div>

        <div className="mt-20">
          <label className="mb-3 block text-sm font-medium">
            Feature Image
          </label>
          <input type="file" onChange={handleFileChange} className="w-full" />
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="mr-4 rounded-lg bg-gray-300 px-4 py-2 text-black"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="rounded-lg bg-blue-500 px-4 py-2 text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBlogModal;
