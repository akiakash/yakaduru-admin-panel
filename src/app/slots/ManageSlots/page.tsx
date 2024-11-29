"use client";
import React, { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { fetchSlots } from "@/controller/Slots/Slots";
import { fetchTourById } from "@/controller/safari/Safari";
import { deleteSlot, editSlot } from "@/controller/Slots/Slots"; // Import the editSlot function

interface Slot {
  id: string;
  number: number;
  tourId: number; // Change from string to number
  available: boolean;
  tour?: { name: string };
}

export default function ManageSlots() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingSlot, setEditingSlot] = useState<Slot | null>(null); // Track slot being edited

  const fetchData = async () => {
    const data = await fetchSlots();
    if (data.success && data.data) {
      setSlots(data.data); // Store all fetched slots

      // Fetch tour data for each slot and attach it
      const updatedSlots = await Promise.all(
        data.data.map(async (slot: { tourId: string }) => {
          const tourData = await fetchTourById(slot.tourId);
          if (tourData.success && tourData.data) {
            return {
              ...slot,
              tourId: Number(slot.tourId), // Ensure tourId is a number
              tour: { name: tourData.data.name },
            };
          }
          return slot;
        }),
      );

      setSlots(updatedSlots); // Update slots with tour information
    } else {
      console.error(data.message);
    }
    setLoading(false);
  };

  // Fetch the slots when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  // Handle Edit action and open the modal
  const handleEdit = (slotId: string) => {
    const slotToEdit = slots.find((slot) => slot.id === slotId);
    if (slotToEdit) {
      setEditingSlot(slotToEdit); // Set the selected slot to be edited
      setIsEditing(true); // Show the modal or form
    }
  };

  // Handle Delete action and update the state
  const handleDelete = async (slotId: string) => {
    const result = await deleteSlot(slotId);
    if (result) {
      setSlots(slots.filter((slot) => slot.id !== slotId)); // Remove the deleted slot from the state
      fetchData();
    } else {
      console.error("Error deleting slot:", result);
    }
  };

  // Handle the submission of the edited slot data
  const handleEditSubmit = async () => {
    if (editingSlot) {
      const result = await editSlot(editingSlot.id, editingSlot); // Make the API call to edit the slot
      if (result) {
        setSlots(
          slots.map((slot) =>
            slot.id === editingSlot.id ? editingSlot : slot,
          ),
        ); // Update the slot in the state

        setIsEditing(false); // Close the modal
        fetchData();
      } else {
        console.error("Error editing slot:", result);
      }
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="MANAGE SLOTS" />

      <div className="flex w-full justify-center">
        <div className="flex w-full max-w-[720px] flex-col gap-9">
          {/* Slot Management Section */}
          <div className="mt-10 rounded-sm border border-stroke bg-white p-10 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <div className="flex flex-col gap-5">
                <h1>MANAGE SLOTS</h1>

                {/* Slot List */}
                {loading ? (
                  <div>Loading slots...</div>
                ) : (
                  <div>
                    <table className="w-full table-auto border-collapse">
                      <thead>
                        <tr>
                          <th className="border-b px-4 py-2 text-left">
                            Safari Types
                          </th>
                          <th className="border-b px-4 py-2 text-left">
                            Slots Count
                          </th>
                          <th className="border-b px-4 py-2 text-left">
                            Available Slots
                          </th>
                          <th className="border-b px-4 py-2 text-left">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {slots.length > 0 ? (
                          slots.map((slot) => (
                            <tr key={slot.id}>
                              <td className="border-b px-4 py-2">
                                {slot.tour?.name || "No tour available"}
                              </td>
                              <td className="border-b px-4 py-2">
                                {slot.number}
                              </td>
                              <td className="border-b px-4 py-2">
                                {slot.number}
                              </td>

                              {/* Action Buttons */}
                              <td className="flex flex-row border-b px-4 py-2">
                                <button
                                  onClick={() => handleEdit(slot.id)}
                                  className="mr-2 rounded bg-blue-500 px-4 py-2 text-white"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(slot.id)}
                                  className="rounded bg-red-500 px-4 py-2 text-white"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="py-2 text-center">
                              No slots available.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Edit Slot Modal */}
          {isEditing && editingSlot && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50">
              <div className="w-full max-w-[500px] rounded-lg bg-white p-8 shadow-lg">
                <h2 className="mb-4 text-xl font-semibold">Edit Slot</h2>
                <div>
                  <label htmlFor="tourName" className="mb-2 block">
                    Safari Type
                  </label>
                  <input
                    type="text"
                    id="tourName"
                    value={editingSlot.tour?.name || ""}
                    onChange={(e) =>
                      setEditingSlot({
                        ...editingSlot,
                        tour: { name: e.target.value },
                      })
                    }
                    className="mb-4 w-full rounded border border-gray-300 px-4 py-2"
                    disabled
                  />
                </div>

                <div>
                  <label htmlFor="slotsCount" className="mb-2 block">
                    Slots Count
                  </label>
                  <input
                    type="number"
                    id="slotsCount"
                    value={editingSlot.number}
                    onChange={(e) =>
                      setEditingSlot({
                        ...editingSlot,
                        number: parseInt(e.target.value, 10),
                      })
                    }
                    className="mb-4 w-full rounded border border-gray-300 px-4 py-2"
                  />
                </div>

                <button
                  onClick={handleEditSubmit}
                  className="mr-2 rounded bg-blue-500 px-6 py-2 text-white"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="rounded bg-gray-500 px-6 py-2 text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
}
