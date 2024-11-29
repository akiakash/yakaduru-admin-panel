"use client";
import React, { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { fetchTours } from "@/controller/safari/Safari";
import { addSlot } from "@/controller/Slots/Slots";

const AllocateSlots = () => {
  const [packages, setPackages] = useState<TourData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [slotsCount, setSlotsCount] = useState<number>();
  const [selectedTourId, setSelectedTourId] = useState<number | undefined>(
    undefined,
  ); // Initialize as undefined

  // Fetch all tours when the component mounts
  const fetchData = async () => {
    try {
      const data = await fetchTours();
      if (data) {
        setPackages(data.data);
        console.log(data.data);
      }
    } catch (error) {
      console.error("Error fetching tours:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  interface TourData {
    name: string;
    price: number;
    overview: string[];
    includes: string[];
    expectations: string[];
    image: string[];
    id: string;
  }

  // Function to handle slot creation
  // Function to handle slot creation
  const handleAddSlot = async () => {
    if (!selectedTourId || (slotsCount ?? 0) <= 0) {
      alert("Please select a valid tour and enter a valid slot count.");
      return;
    }

    const slotData = {
      number: slotsCount ?? 0, // Default to 0 if slotsCount is undefined
      tourId: selectedTourId, // Assuming selectedTourId is a valid number
    };

    try {
      const response = await addSlot(slotData); // Call the addSlot function

      if (response.success) {
        alert("Slots added successfully!");
        // Optionally reset fields or handle state here
        setSlotsCount(0);
        setSelectedTourId(undefined); // Reset to undefined instead of 0
      } else {
        // Improved error handling: Ensure that the response message is not undefined or empty
        const errorMessage = response.message || "Unknown error occurred.";
        alert("addes suucessfully slot: " + errorMessage);
      }
    } catch (error) {
      console.error("Error adding slot", error);
      alert("Error adding slot. Please try again.");
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="ALLOCATE SLOTS FOR EACH SAFARI PACKAGE" />

      <div className="flex w-full justify-center">
        <div className="flex w-full max-w-[720px] flex-col gap-9">
          {/* Input Fields */}
          <div className="mt-10 rounded-sm border border-stroke bg-white p-10 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <div className="flex flex-col gap-5">
                <h1>ADD SLOTS</h1>
                <div className="flex flex-col">
                  <label className="text-[16px] font-bold font-normal leading-[24px] text-[#000]">
                    Safari Type
                  </label>

                  {/* Dropdown for Safari Type */}
                  <select
                    id="safariType"
                    name="safariType"
                    className="h-[48px] border-[1px] border-[#8F8681] px-4"
                    value={selectedTourId ?? ""}
                    onChange={(e) => setSelectedTourId(Number(e.target.value))}
                  >
                    <option value="" disabled>
                      Select a Safari Type
                    </option>{" "}
                    {/* Placeholder */}
                    {loading ? (
                      <option>Loading...</option>
                    ) : (
                      packages.map((tour) => (
                        <option key={tour.id} value={tour.id}>
                          {tour.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Slots Count
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={slotsCount}
                    onChange={(e) => setSlotsCount(Number(e.target.value))}
                    placeholder="Slots Count"
                    className="w-full rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Add Slot Button */}
            <div className="mt-5 flex justify-end">
              <button
                onClick={handleAddSlot}
                className="rounded bg-blue-600 px-6 py-2 text-white"
              >
                Add Slots
              </button>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default AllocateSlots;
