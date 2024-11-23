"use client";
import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import {
  addTour,
  deleteTour,
  fetchTourById,
  fetchTours,
} from "@/controller/safari/Safari"; // Ensure this function exists
import PackageCard from "@/components/SafariBookingCard/PackageCard";
import Modal from "@/components/Modal/Modal";

const ManageSafariBookings = () => {
  const [packages, setPackages] = useState<TourData[]>([]);

  const fetchData = async () => {
    try {
      const data = await fetchTours();
      if (data) {
        setPackages(data.data); // Update state only if data is valid
        console.log(data.data); // Log fetched data
      }
    } catch (error) {
      console.error("Error fetching tours:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array ensures fetch happens only once

  const handleDelete = async (id: string) => {
    const success = await deleteTour(id); // Call the deleteTour API
    if (success) {
      setPackages((prev) => prev.filter((pkg) => pkg.id !== id)); // Remove deleted package from the UI
      fetchData();
    } else {
      console.error("Failed to delete tour package");
    }
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [currentTour, setCurrentTour] = useState<TourData | undefined>(
    undefined,
  ); // Change from array to single object

  // Handle input change

  interface TourData {
    name: string;
    price: number;
    overview: string[]; // Changed to string[] for array of strings
    includes: string[]; // Changed to string[] for array of strings
    expectations: string[]; // Changed to string[] for array of strings
    image: string[];
    id: string;
  }

  // Handle form submission

  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = async (id: string) => {
    try {
      const tourResponse = await fetchTourById(id); // fetchTourById returns a TourResponse

      // Check if the response is successful and contains data
      if (tourResponse?.success && tourResponse.data) {
        const tourData = tourResponse.data; // Extract the data (which is of type TourData)
        setCurrentTour(tourData); // Set the current tour data in state

        setModalOpen(true); // Open the modal
        console.log(tourData, "current tour");
      } else {
        console.error("Tour not found or invalid response");
      }
    } catch (error) {
      console.error("Error fetching tour by ID:", error);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    fetchData();
  };
  const handleConfirm = () => {
    console.log("Confirmed!");
    closeModal();
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="MANAGE SAFARI PACKAGES" />

      <div className="flex w-full justify-center">
        <div className="flex w-full  flex-col gap-9">
          {/* <!-- Input Fields --> */}
          {/* <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
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
          </div> */}
          <PackageCard
            packages={packages}
            onDelete={handleDelete}
            openModal={openModal}
          />

          <Modal
            isOpen={isModalOpen}
            onClose={closeModal}
            onConfirm={handleConfirm}
            title="Confirm Action"
            message="Are you sure you want to proceed with this action?"
            packageDetails={currentTour}
          />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ManageSafariBookings;
