import { editTour } from "@/controller/safari/Safari";
import React, { useState, useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  packageDetails?: {
    id: string; // Add an id field to packageDetails
    name: string;
    price: number;
    overview: string[];
    includes: string[];
    expectations: string[];
  };
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  packageDetails = {
    id: "", // Default value for id
    name: "",
    price: 0,
    overview: "",
    includes: "",
    expectations: "",
  },
}) => {
  const [formData, setFormData] = useState({
    name: packageDetails.name,
    price: packageDetails.price,
    overview: packageDetails.overview,
    includes: packageDetails.includes,
    expectations: packageDetails.expectations,
  });

  const [loading, setLoading] = useState(true);

  //   useEffect(() => {
  //     if (packageDetails) {
  //       setFormData({
  //         name: packageDetails.name,
  //         price: packageDetails.price,
  //         overview: packageDetails.overview,
  //         includes: packageDetails.includes,
  //         expectations: packageDetails.expectations,
  //       });
  //     }
  //   }, [packageDetails]);

  useEffect(() => {
    // Compare the current packageDetails with the current formData to avoid unnecessary state updates
    if (
      packageDetails.name !== formData.name ||
      packageDetails.price !== formData.price ||
      packageDetails.overview !== formData.overview ||
      packageDetails.includes !== formData.includes ||
      packageDetails.expectations !== formData.expectations
    ) {
      setFormData({
        name: packageDetails.name,
        price: packageDetails.price,
        overview: packageDetails.overview,
        includes: packageDetails.includes,
        expectations: packageDetails.expectations,
      });
    }
  }, [packageDetails]); // Adding formData as dependency to avoid infinite loop

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    // Call the editTour API function with the current form data
    const tourData = {
      name: formData.name,
      price: formData.price,
      overview:
        typeof formData.overview === "string"
          ? formData.overview.split("\n")
          : formData.overview,
      includes:
        typeof formData.includes === "string"
          ? formData.includes.split("\n")
          : formData.includes,
      expectations:
        typeof formData.expectations === "string"
          ? formData.expectations.split("\n")
          : formData.expectations,
      image: [],
    };

    const result = await editTour(packageDetails.id, tourData);

    if (result.success) {
      onClose(); // Close the modal
    } else {
      console.error("Error updating tour:", result.message);
      // You can display an error message if needed
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="max-h-[80vh] w-[720px] overflow-y-auto rounded-lg bg-white p-6">
        <div className="flex w-full justify-center">
          <div className="flex w-full max-w-[720px] flex-col gap-9">
            {/* Package Details */}
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Package Details
                </h3>
              </div>
              <div className="flex flex-col gap-5.5 p-6.5">
                {/* Safari Name */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Safari Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Safari Name"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Price"
                    className="w-full rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                  />
                </div>

                {/* Overview */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Overview
                  </label>
                  <textarea
                    rows={6}
                    name="overview"
                    value={formData.overview}
                    onChange={handleChange}
                    placeholder="Overview"
                    className="w-full rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                  />
                </div>

                {/* Includes */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Includes
                  </label>
                  <textarea
                    rows={6}
                    name="includes"
                    value={formData.includes}
                    onChange={handleChange}
                    placeholder="Includes"
                    className="w-full rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                  ></textarea>
                </div>

                {/* Expectations */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Expectations
                  </label>
                  <textarea
                    rows={6}
                    name="expectations"
                    value={formData.expectations}
                    onChange={handleChange}
                    placeholder="Expectations"
                    className="w-full rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <div className="flex flex-row gap-5">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 disabled:opacity-50"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
