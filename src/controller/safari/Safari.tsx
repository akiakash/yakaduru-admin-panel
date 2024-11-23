require("dotenv").config();
import axios from "axios";

// Define API URL
const API_URL = "http://localhost:3002/api/";

// Tour Data Interface
interface TourData {
  name: string;
  price: number;
  overview: string[];
  includes: string[];
  expectations: string[];
  image: string[];
}

// Response Interface for Tour Actions
interface TourResponse {
  success: boolean;
  message: string;
  data: TourData[] | TourData | any; // To accommodate single or multiple tours
}

// Error Response Interface (for error handling)
interface ErrorResponse {
  success: false;
  message: string;
  data: null;
}

// Add Tour Function
export const addTour = async (
  tourData: TourData,
): Promise<TourResponse | ErrorResponse> => {
  try {
    const response = await axios.post<TourResponse>(
      `${API_URL}tours`,
      tourData,
    );
    return response.data;
  } catch (error) {
    console.error("Error adding tour", error);
    return { success: false, message: "Error adding tour", data: null };
  }
};

// Edit Tour Function
export const editTour = async (
  id: string,
  tourData: TourData,
): Promise<TourResponse | ErrorResponse> => {
  try {
    const response = await axios.put<TourResponse>(
      `${API_URL}tours/${id}`,
      tourData,
    );
    return response.data;
  } catch (error) {
    console.error("Error updating tour", error);
    return { success: false, message: "Error updating tour", data: null };
  }
};

// Delete Tour Function
export const deleteTour = async (
  id: string,
): Promise<TourResponse | ErrorResponse> => {
  try {
    const response = await axios.delete<TourResponse>(`${API_URL}tours/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting tour", error);
    return { success: false, message: "Error deleting tour", data: null };
  }
};

// Fetch All Tours Function
export const fetchTours = async (): Promise<TourResponse | ErrorResponse> => {
  try {
    const response = await axios.get<TourResponse>(`${API_URL}tours`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tours:", error);
    return { success: false, message: "Failed to fetch tours", data: null };
  }
};

// Fetch Single Tour by ID
export const fetchTourById = async (
  id: string,
): Promise<TourResponse | ErrorResponse> => {
  try {
    const response = await axios.get<TourResponse>(`${API_URL}tours/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tour by ID", error);
    return { success: false, message: "Tour not found", data: null };
  }
};
