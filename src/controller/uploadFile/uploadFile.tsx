import axios from "axios";

// Define API URL
const API_URL = "http://localhost:3002/api/"; // Adjust based on your backend's URL

// Response Interface
interface UploadResponse {
  success: boolean;
  message: string;
  urls: string[]; // Array of uploaded file URLs
}

// Error Response Interface
interface ErrorResponse {
  success: false;
  message: string;
  urls: null;
}

// Upload Files Function
export const uploadFiles = async (
  files: File[],
): Promise<UploadResponse | ErrorResponse> => {
  try {
    // Create FormData to send files
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file); // Use "files" as the field name
    });

    // Make POST request to upload files
    const response = await axios.post<UploadResponse>(
      `${API_URL}upload-multiple`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Required for file uploads
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error("Error uploading files", error);
    return {
      success: false,
      message: "Failed to upload files",
      urls: null,
    };
  }
};
