import axios from "axios";

// Define the structure of the Tour data
export interface Tour {
  id?: number;
  name: string;
  price: number;
  overview?: string;
  includes?: string;
  expectations?: string;
  image?: string;
}

const BASE_URL = "http://localhost:3002/api/tours"; // Update with your backend URL

// Add a new tour
export const addTour = async (tourData: Tour) => {
  try {
    const response = await axios.post(BASE_URL, tourData);
    return response.data;
  } catch (error) {
    console.error("Error adding tour:", error);
    throw error;
  }
};

// Fetch all tours
export const getAllTours = async (): Promise<{
  success: boolean;
  data: Tour[];
}> => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching tours:", error);
    throw error;
  }
};

// Fetch a single tour by ID
export const getTourById = async (
  id: number,
): Promise<{ success: boolean; data: Tour | null }> => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tour:", error);
    throw error;
  }
};

// Update a tour
export const updateTour = async (id: number, tourData: Tour) => {
  try {
    const response = await axios.put(`${BASE_URL}/${id}`, tourData);
    return response.data;
  } catch (error) {
    console.error("Error updating tour:", error);
    throw error;
  }
};

// Delete a tour
export const deleteTour = async (id: number) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting tour:", error);
    throw error;
  }
};
