import axios from "axios";

const API_URL = "http://localhost:3002/api/";

// AddOn Data Interface
export interface AddOn {
  id?: number; // Optional for create
  name: string;
  price: number;
  categoryId: number;
}

// Response Interface for AddOn Actions
interface AddOnResponse {
  success: boolean;
  message: string;
  data: AddOn[] | AddOn | null; // To accommodate single or multiple add-ons
}

// Error Response Interface
interface ErrorResponse {
  success: false;
  message: string;
  data: null;
}

// Add AddOn Function
export const createAddOn = async (
  addOn: AddOn,
): Promise<AddOnResponse | ErrorResponse> => {
  try {
    const response = await axios.post<AddOnResponse>(
      `${API_URL}add-ons`,
      addOn,
    );
    return response.data;
  } catch (error: any) {
    console.error("Error creating add-on", error);
    return { success: false, message: "Error creating add-on", data: null };
  }
};

// Get All AddOns Function
export const getAllAddOns = async (): Promise<
  AddOnResponse | ErrorResponse
> => {
  try {
    const response = await axios.get<AddOnResponse>(`${API_URL}add-ons`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching add-ons", error);
    return { success: false, message: "Error fetching add-ons", data: null };
  }
};

// Update AddOn Function
export const updateAddOn = async (
  id: number,
  addOn: Partial<AddOn>,
): Promise<AddOnResponse | ErrorResponse> => {
  try {
    const response = await axios.put<AddOnResponse>(
      `${API_URL}add-ons/${id}`,
      addOn,
    );
    return response.data;
  } catch (error: any) {
    console.error("Error updating add-on", error);
    return { success: false, message: "Error updating add-on", data: null };
  }
};

// Delete AddOn Function
export const deleteAddOn = async (
  id: number,
): Promise<AddOnResponse | ErrorResponse> => {
  try {
    const response = await axios.delete<AddOnResponse>(
      `${API_URL}add-ons/${id}`,
    );
    return response.data;
  } catch (error: any) {
    console.error("Error deleting add-on", error);
    return { success: false, message: "Error deleting add-on", data: null };
  }
};
