"use client";
import React, { useEffect, useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import {
  fetchBlogs,
  editBlog,
  deleteBlog,
} from "../../../controller/Blogs/Blogs";
import EditBlogModal from "@/components/EditBlogComponent/EditBlog"; // Ensure this is the correct path
import { fetchCategories } from "@/controller/Categories/Categories";
import { fetchTags } from "@/controller/Tags/Tags";

interface Blog {
  id: string;
  title: string;
  categories: string[]; // Array of category IDs
  tags: string[]; // Array of tag IDs
  author: string;
  content: string;
  featureImage?: string;
}

interface Category {
  id: Number;
  name: string;
}

interface Tag {
  id: Number;
  name: string;
}

const ManageBlogs: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const getCategoriesAndTags = async () => {
      try {
        const [categoriesData, tagsData] = await Promise.all([
          fetchCategories(),
          fetchTags(),
        ]);

        if (categoriesData.success && tagsData.success) {
          setCategories(categoriesData.data as Category[]);
          setTags(tagsData.data as Tag[]);
        } else {
          setError("Failed to fetch categories or tags");
        }
      } catch (error) {
        setError("Failed to fetch categories or tags");
      }
    };

    const getBlogs = async () => {
      try {
        const blogsData = await fetchBlogs();
        if (blogsData.success) {
          setBlogs(blogsData.data as unknown as Blog[]);
        } else {
          setError(blogsData.message);
        }
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch blogs");
        setLoading(false);
      }
    };

    getCategoriesAndTags();
    getBlogs();
  }, []);
  console.log(categories, "categories");

  //   useEffect(() => {
  //     console.log(categories, "categoriescategories");
  //   }, [categories]); // This will run whenever categories change

  const handleEdit = (blog: Blog) => {
    setSelectedBlog(blog);
    setIsModalOpen(true);
  };

  const handleSave = async (updatedBlog: Blog) => {
    if (updatedBlog) {
      try {
        const response = await editBlog(updatedBlog.id, updatedBlog);
        if (response.success) {
          setBlogs(
            blogs.map((blog) =>
              blog.id === updatedBlog.id ? updatedBlog : blog,
            ),
          );
          setIsModalOpen(false);
        } else {
          alert("Error updating blog");
        }
      } catch (error) {
        alert("Error updating blog");
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBlog(id);
      setBlogs(blogs.filter((blog) => blog.id !== id));
    } catch (error) {
      setError("Error deleting blog");
    }
  };

  const getCategoryName = (categoryId: string | number) => {
    // Ensure categoryId is treated as a number
    const categoryIdAsNumber = Number(categoryId);
    const category = categories.find((cat) => cat.id === categoryIdAsNumber);

    console.log(categories, "categories in getCategoryName");

    if (!category) {
      console.error(`Category ID ${categoryId} not found`);
      return categoryId; // Return the ID if the name is not found
    }
    return category.name;
  };

  const getTagName = (tagId: string | number) => {
    // Ensure categoryId is treated as a number
    const tagIdAsNumber = Number(tagId);
    const tag = tags.find((cat) => cat.id === tagIdAsNumber);

    console.log(categories, "categories in getCategoryName");

    if (!tag) {
      console.error(`Category ID ${tagId} not found`);
      return tagId; // Return the ID if the name is not found
    }
    return tag.name;
  };

  // Helper function to get tag name by ID
  //   const getTagName = (tagId: string) => {
  //     const tag = tags.find((tag) => tag.id === tagId);
  //     if (!tag) {
  //       console.error(`Tag ID ${tagId} not found`);
  //       return tagId; // Return the ID if the name is not found
  //     }
  //     return tag.name;
  //   };

  return (
    <div className="min-h-screen bg-gray-100">
      <DefaultLayout>
        <div className="container mx-auto max-w-[720px] p-4">
          {/* Loading and Error States */}
          {loading && <div className="text-center text-xl">Loading...</div>}
          {error && <div className="text-center text-red-500">{error}</div>}

          {/* Blog List */}
          <div className="space-y-4">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="rounded-lg bg-white p-6 shadow-md transition-shadow duration-300 hover:shadow-lg"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {blog.title}
                  </h3>
                  <div>
                    <button
                      onClick={() => handleEdit(blog)}
                      className="mr-3 text-blue-500 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(blog.id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="mb-2 text-gray-600">
                  Categories: {blog.categories.map(getCategoryName).join(", ")}
                </p>
                <p className="mb-2 text-gray-600">
                  Tags: {blog.tags.map(getTagName).join(", ")}
                </p>
                {/* <p
                  className="text-gray-700"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                /> */}
              </div>
            ))}
          </div>
        </div>

        {/* Edit Blog Modal */}
        <EditBlogModal
          blog={selectedBlog}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      </DefaultLayout>
    </div>
  );
};

export default ManageBlogs;
