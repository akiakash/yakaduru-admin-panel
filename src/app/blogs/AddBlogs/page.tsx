"use client";

import React, { useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { addBlog } from "@/controller/Blogs/Blogs";
import { uploadFiles } from "@/controller/uploadFile/uploadFile";
import RichTextEditor from "@/components/RichTextEditor/ReactQuill";
import TextEditor from "@/components/RichTextEditor/ReactQuill";
// import Editor from "@/components/RichTextEditor/ReactQuill";
import CategoryMultiSelect from "./CategoryMultiSelect";
import MultiSelect from "@/components/FormElements/MultiSelect";
import TagsMultiSelect from "./TagsMultiSelect";
import dynamic from "next/dynamic";

// Define the BlogData interface
interface BlogData {
  title: string;
  description: string;
  categories: string[];
  tags: string[];
  author: string;
  content: string;
  featureImage?: string; // Store the image URL
}

// Define the BlogResponse and ErrorResponse interfaces
interface BlogResponse {
  success: boolean;
  message: string;
  data: any;
}

const Editor = dynamic(() => import("@/components/RichTextEditor/ReactQuill"), {
  ssr: false,
});

export default function Page() {
  // States
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [author, setAuthor] = useState<string>("");
  const [featureImage, setFeatureImage] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [editorContent, setEditorContent] = useState("");

  const handleEditorChange = (value: React.SetStateAction<string>) => {
    setEditorContent(value);
    console.log("Editor Content:", value);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFeatureImage(event.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    let featureImageUrl = "";

    try {
      // Upload the feature image if selected
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

      const blogData: BlogData = {
        title,
        description,
        categories,
        tags,
        author,
        content: editorContent,
        featureImage: featureImageUrl,
      };

      const response = await addBlog(blogData);
      if (response.success) {
        console.log("Blog created successfully:", response.data);
        setTitle("");
        setCategories([]);
        setTags([]);
        setAuthor("");
        setEditorContent("");
        setFeatureImage(null);
      } else {
        console.error("Error adding blog:", response.message);
        alert("Failed to create blog: " + response.message);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };
  // handleEditorSubmit = (content) => {
  //   // Handle the content from the editor
  //   console.log("Received content:", content);
  //   this.setState({ editorContent: content });
  // };

  const handleSelectTags = (value: string[]) => {
    console.log("", value);
    setTags(value);
  };
  const handleSelectedCategories = (value: string[]) => {
    console.log("", value);
    setCategories(value);
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="ADD BLOG" />

      <div className="flex w-full justify-center">
        <div className="flex w-full max-w-[720px] flex-col gap-9 rounded-[10px] bg-white p-10">
          {/* Title Input */}
          <div>
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Title
            </label>
            <input
              type="text"
              name="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter Title"
              className="w-full rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
            />
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Description
            </label>
            <input
              type="text"
              name="Title"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter Description"
              className="w-full rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
            />
          </div>

          {/* Multi-Select for Categories */}

          <div>
            <CategoryMultiSelect
              id="multiSelect"
              onSelect={handleSelectedCategories}
            />
          </div>
          {/* Multi-Select for Tags */}
          <div>
            <TagsMultiSelect id="multiSelect" onSelect={handleSelectTags} />
          </div>

          {/* Author Input */}
          <div>
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Author
            </label>
            <input
              type="text"
              name="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Enter Author Name"
              className="w-full rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
            />
          </div>

          {/* <MultiSelect id={""} /> */}

          {/* File Upload */}
          <div>
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Attach File
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
            />
          </div>

          {/* Rich Text Editor for Description */}
          <div>
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Description
            </label>
            <Editor onChange={handleEditorChange} />
          </div>

          {/* Submit Button */}
          <div className="mt-10">
            <button
              onClick={handleSubmit}
              className="rounded-lg bg-primary px-5 py-3 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Blog"}
            </button>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
