"use client";
import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { addTour } from "@/controller/safari/Safari"; // Ensure this function exists

const AddSafari = () => {
  const [formData, setFormData] = useState({
    safariName: "",
    price: "",
    overview: [] as string[], // Initialize as empty array of strings
    includes: [] as string[], // Initialize as empty array of strings
    expectations: [] as string[], // Initialize as empty array of strings
    image: [] as string[],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Handle input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    // For textarea fields (arrays of strings), split the input by newlines
    if (name === "overview" || name === "includes" || name === "expectations") {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value.split("\n"), // Split the value into an array of strings
      }));
    } else {
      // For input fields like safariName, we directly set the value as a string
      setFormData((prevState) => ({
        ...prevState,
        [name]: value, // Directly set the string value
      }));
    }
  };

  interface TourData {
    name: string;
    price: number;
    overview: string[]; // Changed to string[] for array of strings
    includes: string[]; // Changed to string[] for array of strings
    expectations: string[]; // Changed to string[] for array of strings
    image: string[];
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Create an object that matches the TourData interface
    const tourData: TourData = {
      name: formData.safariName,
      price: parseFloat(formData.price),
      overview: formData.overview,
      includes: formData.includes,
      expectations: formData.expectations,
      image: formData.expectations,
    };

    try {
      const response = await addTour(tourData);

      // Assuming response contains a message and data
      if (response && response.message === "Tour added successfully!") {
        setSuccess(response.message); // Display the success message from response
        setFormData({
          safariName: "",
          price: "",
          overview: [],
          includes: [],
          expectations: [],
          image: [],
        });
      } else {
        setError("Failed to add tour package. Please try again.");
      }
    } catch (error) {
      setError("An error occurred while adding the tour package.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="ADD SAFARI PACKAGES" />

      <div className="flex w-full justify-center">
        <div className="flex w-full max-w-[720px] flex-col gap-9">
          {/* <!-- Input Fields --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Package Details
              </h3>
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">
              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Safari Name
                </label>
                <input
                  type="text"
                  name="safariName"
                  placeholder="Safari Name"
                  value={formData.safariName}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                />
              </div>

              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Overview
                </label>
                <textarea
                  rows={6}
                  name="overview"
                  placeholder="Overview"
                  value={formData.overview.join("\n")}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                />
              </div>
              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Includes
                </label>
                <textarea
                  rows={6}
                  name="includes"
                  placeholder="Includes"
                  value={formData.includes.join("\n")}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                ></textarea>
              </div>
              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Expectations
                </label>
                <textarea
                  rows={6}
                  name="expectations"
                  placeholder="Expectations"
                  value={formData.expectations.join("\n")}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                ></textarea>
              </div>

              <div>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 disabled:opacity-50"
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          </div>

          {success && <div className="text-green-500">{success}</div>}
          {error && <div className="text-red-500">{error}</div>}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default AddSafari;
