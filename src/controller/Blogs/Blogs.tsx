import axios from "axios";

// Define API URL
const API_URL = "http://localhost:3002/api/";

// Blog Data Interface
interface BlogData {
  title: string;
  description: string;
  categories: string[];
  tags: string[];
  author: string;
  featureImage?: string; // Add optional property
  content: string;
}

// Response Interface for Blog Actions
interface BlogResponse {
  success: boolean;
  message: string;
  data: BlogData[] | BlogData | null; // To accommodate single or multiple blogs
}

// Error Response Interface
interface ErrorResponse {
  success: false;
  message: string;
  data: null;
}

// Add Blog Function
export const addBlog = async (
  blogData: BlogData,
): Promise<BlogResponse | ErrorResponse> => {
  try {
    const response = await axios.post<BlogResponse>(
      `${API_URL}blogs`,
      blogData,
    );
    return response.data;
  } catch (error) {
    console.error("Error adding blog", error);
    return { success: false, message: "Error adding blog", data: null };
  }
};

// Edit Blog Function
export const editBlog = async (
  id: string,
  blogData: BlogData,
): Promise<BlogResponse | ErrorResponse> => {
  try {
    const response = await axios.put<BlogResponse>(
      `${API_URL}blogs/${id}`,
      blogData,
    );
    return response.data;
  } catch (error) {
    console.error("Error updating blog", error);
    return { success: false, message: "Error updating blog", data: null };
  }
};

// Delete Blog Function
export const deleteBlog = async (
  id: string,
): Promise<BlogResponse | ErrorResponse> => {
  try {
    const response = await axios.delete<BlogResponse>(`${API_URL}blogs/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting blog", error);
    return { success: false, message: "Error deleting blog", data: null };
  }
};

// Fetch All Blogs Function
export const fetchBlogs = async (): Promise<BlogResponse | ErrorResponse> => {
  try {
    const response = await axios.get<BlogResponse>(`${API_URL}blogs`);
    return response.data;
  } catch (error) {
    console.error("Error fetching blogs", error);
    return { success: false, message: "Failed to fetch blogs", data: null };
  }
};

// Fetch Single Blog by ID
export const fetchBlogById = async (
  id: string,
): Promise<BlogResponse | ErrorResponse> => {
  try {
    const response = await axios.get<BlogResponse>(`${API_URL}blogs/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching blog by ID", error);
    return { success: false, message: "Blog not found", data: null };
  }
};
