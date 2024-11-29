import axios from "axios";

// Define API URL
const API_URL = "http://localhost:3002/api/";

// Slot Data Interface
interface SlotData {
  number: number;
  tourId: number;
}

// Response Interface for Slot Actions
interface SlotResponse {
  success: boolean;
  message: string;
  data: SlotData[] | SlotData | any; // To accommodate single or multiple slots
}

// Error Response Interface (for error handling)
interface ErrorResponse {
  success: false;
  message: string;
  data: null;
}

// Add Slot Function
export const addSlot = async (
  slotData: SlotData,
): Promise<SlotResponse | ErrorResponse> => {
  try {
    const response = await axios.post<SlotResponse>(
      `${API_URL}slots`,
      slotData,
    );
    return response.data;
  } catch (error) {
    console.error("Error adding slot", error);
    return { success: false, message: "Error adding slot", data: null };
  }
};

// Edit Slot Function
export const editSlot = async (
  id: string,
  slotData: SlotData,
): Promise<SlotResponse | ErrorResponse> => {
  try {
    const response = await axios.put<SlotResponse>(
      `${API_URL}slots/${id}`,
      slotData,
    );
    return response.data;
  } catch (error) {
    console.error("Error updating slot", error);
    return { success: false, message: "Error updating slot", data: null };
  }
};

// Delete Slot Function
export const deleteSlot = async (
  id: string,
): Promise<SlotResponse | ErrorResponse> => {
  try {
    const response = await axios.delete<SlotResponse>(`${API_URL}slots/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting slot", error);
    return { success: false, message: "Error deleting slot", data: null };
  }
};

// Fetch All Slots Function
export const fetchSlots = async (): Promise<SlotResponse | ErrorResponse> => {
  try {
    const response = await axios.get<SlotResponse>(`${API_URL}slots`);
    return response.data;
  } catch (error) {
    console.error("Error fetching slots:", error);
    return { success: false, message: "Failed to fetch slots", data: null };
  }
};

// Fetch Slots by Tour ID Function
export const fetchSlotsByTourId = async (
  tourId: string,
): Promise<SlotResponse | ErrorResponse> => {
  try {
    const response = await axios.get<SlotResponse>(
      `${API_URL}slots/tour/${tourId}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching slots by tour ID", error);
    return {
      success: false,
      message: "No slots found for this tour",
      data: null,
    };
  }
};
