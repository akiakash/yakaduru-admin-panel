import axios from "axios";

// Define the base URL for the API
const API_URL = "http://localhost:3002/api/";

// Gallery Data Interface
interface GalleryData {
  title: string;
  imageLinks: string[]; // Ensure imageLinks is of type string[]
  categoryId: string;
}

// Response Interface for Gallery Actions
interface GalleryResponse {
  galleries: {
    id: string;
    title: string;
    imageLinks: string[];
    categoryId: string;
  }[];
  success: boolean;
  message: string;
  data: GalleryData[] | GalleryData | null;
}

// Error Response Interface
interface ErrorResponse {
  success: false;
  message: string;
  data: null;
}

// Add Gallery Function
export const addGallery = async (
  galleryData: GalleryData,
): Promise<GalleryResponse | ErrorResponse> => {
  try {
    const response = await axios.post<GalleryResponse>(
      `${API_URL}galleries`, // Ensure trailing slash consistency
      galleryData,
    );
    return response.data;
  } catch (error: any) {
    console.error("Error adding gallery", error);
    return { success: false, message: "Error adding gallery", data: null };
  }
};

// Edit Gallery Function
export const editGallery = async (
  id: string,
  galleryData: GalleryData,
): Promise<GalleryResponse | ErrorResponse> => {
  try {
    const response = await axios.put<GalleryResponse>(
      `${API_URL}galleries/${id}`,
      galleryData,
    );
    return response.data;
  } catch (error) {
    console.error("Error updating gallery", error);
    return { success: false, message: "Error updating gallery", data: null };
  }
};

// Delete Gallery Function
export const deleteGallery = async (
  id: string,
): Promise<GalleryResponse | ErrorResponse> => {
  try {
    const response = await axios.delete<GalleryResponse>(
      `${API_URL}galleries/${id}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting gallery", error);
    return { success: false, message: "Error deleting gallery", data: null };
  }
};

// Fetch All Galleries Function
export const fetchGalleries = async (): Promise<
  GalleryResponse | ErrorResponse
> => {
  try {
    const response = await axios.get<GalleryResponse>(`${API_URL}galleries`);
    return response.data;
  } catch (error) {
    console.error("Error fetching galleries", error);
    return {
      success: false,
      message: "Failed to fetch galleries",
      data: null,
    };
  }
};

// Fetch Single Gallery by ID
export const fetchGalleryById = async (
  id: string,
): Promise<GalleryResponse | ErrorResponse> => {
  try {
    const response = await axios.get<GalleryResponse>(
      `${API_URL}galleries/${id}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching gallery by ID", error);
    return { success: false, message: "Gallery not found", data: null };
  }
};
