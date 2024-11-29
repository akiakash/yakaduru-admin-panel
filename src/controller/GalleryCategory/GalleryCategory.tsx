import axios from "axios";

const API_URL = "http://localhost:3002/api/";

// Category Data Interface
interface CategoryData {
  name: string;
}

// Response Interface for Category Actions
interface CategoryResponse {
  success: boolean;
  message: string;
  data: CategoryData[] | CategoryData | null; // To accommodate single or multiple categories
}

// Error Response Interface
interface ErrorResponse {
  success: false;
  message: string;
  data: null;
}

// Add Category Function
export const addCategory = async (categoryData: {
  name: string;
}): Promise<CategoryResponse> => {
  try {
    const response = await axios.post<CategoryResponse>(
      `${API_URL}gallerycategories`, // Ensure trailing slash consistency
      categoryData,
    );
    return response.data;
  } catch (error: any) {
    console.error("Error adding category", error);
    return { success: false, message: "Error adding category", data: null };
  }
};

// Edit Category Function
export const editCategory = async (
  id: string,
  categoryData: CategoryData,
): Promise<CategoryResponse | ErrorResponse> => {
  try {
    const response = await axios.put<CategoryResponse>(
      `${API_URL}gallerycategories/${id}`,
      categoryData,
    );
    return response.data;
  } catch (error) {
    console.error("Error updating category", error);
    return { success: false, message: "Error updating category", data: null };
  }
};

// Delete Category Function
export const deleteCategory = async (
  id: string,
): Promise<CategoryResponse | ErrorResponse> => {
  try {
    const response = await axios.delete<CategoryResponse>(
      `${API_URL}gallerycategories/${id}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting category", error);
    return { success: false, message: "Error deleting category", data: null };
  }
};

// Fetch All Categories Function
export const fetchCategories = async (): Promise<
  CategoryResponse | ErrorResponse
> => {
  try {
    const response = await axios.get<CategoryResponse>(
      `${API_URL}gallerycategories`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching categories", error);
    return {
      success: false,
      message: "Failed to fetch categories",
      data: null,
    };
  }
};

// Fetch Single Category by ID
export const fetchCategoryById = async (
  id: string,
): Promise<CategoryResponse | ErrorResponse> => {
  try {
    const response = await axios.get<CategoryResponse>(
      `${API_URL}gallerycategories/${id}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching category by ID", error);
    return { success: false, message: "Category not found", data: null };
  }
};
