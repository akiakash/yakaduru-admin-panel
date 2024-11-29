import axios from "axios";

const API_URL = "http://localhost:3002/api/";

// Tag Data Interface
interface TagData {
  name: string;
}

// Response Interface for Tag Actions
interface TagResponse {
  success: boolean;
  message: string;
  data: TagData[] | TagData | null; // To accommodate single or multiple tags
}

// Error Response Interface
interface ErrorResponse {
  success: false;
  message: string;
  data: null;
}

// Add Tag Function
export const addTag = async (tagData: {
  name: string;
}): Promise<TagResponse> => {
  try {
    const response = await axios.post<TagResponse>(
      `${API_URL}tags`, // Ensure trailing slash consistency
      tagData,
    );
    return response.data;
  } catch (error: any) {
    console.error("Error adding tag", error);
    return { success: false, message: "Error adding tag", data: null };
  }
};

// Edit Tag Function
export const editTag = async (
  id: string,
  tagData: TagData,
): Promise<TagResponse | ErrorResponse> => {
  try {
    const response = await axios.put<TagResponse>(
      `${API_URL}tags/${id}`,
      tagData,
    );
    return response.data;
  } catch (error) {
    console.error("Error updating tag", error);
    return { success: false, message: "Error updating tag", data: null };
  }
};

// Delete Tag Function
export const deleteTag = async (
  id: string,
): Promise<TagResponse | ErrorResponse> => {
  try {
    const response = await axios.delete<TagResponse>(`${API_URL}tags/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting tag", error);
    return { success: false, message: "Error deleting tag", data: null };
  }
};

// Fetch All Tags Function
export const fetchTags = async (): Promise<TagResponse | ErrorResponse> => {
  try {
    const response = await axios.get<TagResponse>(`${API_URL}tags`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tags", error);
    return {
      success: false,
      message: "Failed to fetch tags",
      data: null,
    };
  }
};

// Fetch Single Tag by ID
export const fetchTagById = async (
  id: string,
): Promise<TagResponse | ErrorResponse> => {
  try {
    const response = await axios.get<TagResponse>(`${API_URL}tags/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tag by ID", error);
    return { success: false, message: "Tag not found", data: null };
  }
};
