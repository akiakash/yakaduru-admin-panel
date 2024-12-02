import axios from "axios";

// Define the types for the Pricing Rule and Tour
interface PricingRule {
  tourId: string;
  minAdults: number;
  maxAdults: number;
  pricePerAdult: number;
  pricePerChild: number;
}

interface Tour {
  id: string;
  name: string;
}

interface PricingRuleWithTour {
  id: string;
  minAdults: number;
  maxAdults: number;
  pricePerAdult: number;
  pricePerChild: number;
  tour: Tour;
}

interface CostCalculationRequest {
  adults: number;
  children: number;
  tourId: string;
}

interface CostCalculationResponse {
  success: boolean;
  message: string;
  data: {
    totalCost: number;
  };
}

// Set up the base API URL
const API_URL = "http://localhost:3002/api/";

// Function to create a pricing rule
export const createPricingRule = async (pricingRule: PricingRule) => {
  try {
    const response = await axios.post(`${API_URL}pricing-rules`, pricingRule);
    return response.data;
  } catch (error) {
    console.error("Error creating pricing rule:", error);
    throw new Error("Failed to create pricing rule.");
  }
};

// Function to fetch all pricing rules with tours
// Function to fetch all pricing rules with tours
// export const getAllPricingRules = async () => {
//   try {
//     const response = await axios.get<{
//       data(data: any): unknown;
//       success: boolean;
//       pricingRules: PricingRuleWithTour[];
//     }>(`${API_URL}pricing-rules`);
//     return response.data; // Access pricingRules directly from the response
//   } catch (error) {
//     console.error("Error fetching pricing rules:", error);
//     throw new Error("Failed to fetch pricing rules.");
//   }
// };

export const getAllPricingRules = async (): Promise<PricingRuleWithTour[]> => {
  try {
    const response = await axios.get<{
      success: boolean;
      message: string;
      data: PricingRuleWithTour[]; // Define the type of data
    }>(`${API_URL}pricing-rules`);

    // Return the pricingRules array from the API response
    return response.data.data; // Extract the data array containing the pricing rules
  } catch (error) {
    console.error("Error fetching pricing rules:", error);
    throw new Error("Failed to fetch pricing rules.");
  }
};

// Function to fetch a single pricing rule by ID
export const getPricingRuleById = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}pricing-rules/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching pricing rule:", error);
    throw new Error("Failed to fetch pricing rule.");
  }
};

// Function to update a pricing rule
interface UpdatePricingRule {
  minAdults: number;
  maxAdults: number;
  pricePerAdult: number;
  pricePerChild: number;
}

export const updatePricingRule = async (
  id: string,
  updatedRule: UpdatePricingRule,
) => {
  try {
    const response = await axios.put(
      `${API_URL}pricing-rules/${id}`,
      updatedRule,
    );
    return response.data;
  } catch (error) {
    console.error("Error updating pricing rule:", error);
    throw new Error("Failed to update pricing rule.");
  }
};

// Function to delete a pricing rule
export const deletePricingRule = async (id: string) => {
  try {
    const response = await axios.delete(`${API_URL}pricing-rules/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting pricing rule:", error);
    throw new Error("Failed to delete pricing rule.");
  }
};

// Function to calculate the total cost based on adults and children
export const calculateCost = async (request: CostCalculationRequest) => {
  try {
    const response = await axios.post<CostCalculationResponse>(
      `${API_URL}pricing-rules/calculateCost`,
      request,
    );
    return response.data;
  } catch (error) {
    console.error("Error calculating cost:", error);
    throw new Error("Failed to calculate cost.");
  }
};
