import axios from "axios";

const API_BASE_URL = "http://localhost:3002/api/";

// Type definitions for the input and output
export interface SelectedAddOn {
  id: number;
  count: number;
}

export interface CalculateAddOnResponse {
  success: boolean;
  total?: number;
  message?: string;
}

/**
 * Calculates the total price for the selected add-ons.
 * @param {SelectedAddOn[]} selectedAddons - Array of selected add-ons with their IDs and counts.
 * @returns {Promise<CalculateAddOnResponse>} Response from the server.
 */
export const calculateAddOnTotal = async (
  selectedAddons: SelectedAddOn[],
): Promise<CalculateAddOnResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/calculate-total`, {
      selectedAddons,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error calculating add-on total:", error);

    if (error.response && error.response.data) {
      return {
        success: false,
        message: error.response.data.message || "Failed to calculate total",
      };
    }

    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
};
