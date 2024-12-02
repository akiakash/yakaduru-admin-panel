"use client";
import React, { useEffect, useState } from "react";
import {
  getAllAddOns,
  createAddOn,
  deleteAddOn,
  updateAddOn, // Assuming you have an updateAddOn function for editing
} from "../../../controller/AddOn/AddOn"; // Adjust the path as needed
import { fetchCategories } from "../../../controller/AddOnCategory/AddOnCategory"; // Adjust the path as needed
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export default function AddOnManagement() {
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    [],
  );
  const [addons, setAddons] = useState<
    { id: number; name: string; categoryId: number; price: number }[] // Added price to addon type
  >([]);
  const [selectedCategory, setSelectedCategory] = useState<number | string>(""); // categoryId should be a number
  const [newAddonName, setNewAddonName] = useState<string>("");
  const [newAddonPrice, setNewAddonPrice] = useState<number>(0); // State for price
  const [loading, setLoading] = useState<boolean>(false);
  const [editingAddon, setEditingAddon] = useState<{
    id: number;
    name: string;
    categoryId: number;
    price: number;
  } | null>(null);

  // Load Categories and Add-ons
  const loadCategories = async () => {
    setLoading(true);
    const response = await fetchCategories();
    if (response.success) {
      setCategories(response.data as { id: number; name: string }[]); // Adjusted for number type
    }
    setLoading(false);
  };

  const loadAddons = async () => {
    setLoading(true);
    const response = await getAllAddOns();
    if (response.success) {
      setAddons(
        response.data as unknown as {
          id: number;
          name: string;
          categoryId: number;
          price: number; // added price field to add-on
        }[],
      );
    }
    setLoading(false);
  };

  const handleAddAddon = async () => {
    if (newAddonName.trim() && selectedCategory) {
      const categoryId = Number(selectedCategory); // Ensure selectedCategory is a number
      const response = await createAddOn({
        name: newAddonName.trim(),
        categoryId,
        price: newAddonPrice, // Pass price for new add-on
      });
      if (response.success) {
        setAddons((prev) => [
          ...prev,
          response.data as unknown as {
            id: number;
            name: string;
            categoryId: number;
            price: number;
          },
        ]);
        setNewAddonName("");
        setNewAddonPrice(0); // Reset price
      }
    }
  };

  const handleDeleteAddon = async (id: number) => {
    const response = await deleteAddOn(id);
    if (response.success) {
      setAddons((prev) => prev.filter((addon) => addon.id !== id));
    }
  };

  const handleEditAddon = async () => {
    if (editingAddon && newAddonName.trim() && newAddonPrice >= 0) {
      const updatedAddon = {
        name: newAddonName.trim(),
        categoryId: editingAddon.categoryId,
        price: newAddonPrice,
      };

      const response = await updateAddOn(editingAddon.id, updatedAddon);
      if (response.success) {
        setAddons((prev) =>
          prev.map((addon) =>
            addon.id === editingAddon.id
              ? { ...addon, name: newAddonName, price: newAddonPrice }
              : addon,
          ),
        );
        setEditingAddon(null); // Clear editing state after saving
        setNewAddonName("");
        setNewAddonPrice(0); // Reset price after saving
      }
    }
  };

  const handleEditButtonClick = (addon: {
    id: number;
    name: string;
    categoryId: number;
    price: number;
  }) => {
    setEditingAddon({
      id: addon.id,
      name: addon.name,
      categoryId: addon.categoryId, // Include categoryId
      price: addon.price,
    });
    setNewAddonName(addon.name);
    setNewAddonPrice(addon.price);
  };

  useEffect(() => {
    loadCategories();
    loadAddons();
  }, []);

  return (
    <div>
      <DefaultLayout>
        <Breadcrumb pageName="Manage Add Ons" />
        <div className="flex w-full justify-center">
          <div className="flex w-full max-w-[720px] flex-col gap-9 rounded-[10px] bg-white p-10">
            {/* Add Add-on */}
            <div>
              <label className="mb-3 block text-sm font-medium text-black">
                Add Add-on
              </label>
              <div className="flex items-center gap-3">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-1/3 rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none"
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={newAddonName}
                  onChange={(e) => setNewAddonName(e.target.value)}
                  placeholder="Add-on Name"
                  className="w-2/3 rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none"
                />
                <input
                  type="number"
                  value={newAddonPrice}
                  onChange={(e) => setNewAddonPrice(Number(e.target.value))}
                  placeholder="Price"
                  className="w-2/3 rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none"
                />
                <button
                  onClick={handleAddAddon}
                  className="hover:bg-primary-dark rounded-lg bg-primary px-5 py-3 text-white"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Edit Add-on */}
            {editingAddon && (
              <div>
                <h3 className="mb-3 text-lg font-medium text-black">
                  Edit Add-on
                </h3>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={newAddonName}
                    onChange={(e) => setNewAddonName(e.target.value)}
                    placeholder="Edit Add-on Name"
                    className="w-2/3 rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none"
                  />
                  <input
                    type="number"
                    value={newAddonPrice}
                    onChange={(e) => setNewAddonPrice(Number(e.target.value))}
                    placeholder="Edit Price"
                    className="w-2/3 rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none"
                  />
                  <button
                    onClick={handleEditAddon}
                    className="hover:bg-primary-dark rounded-lg bg-primary px-5 py-3 text-white"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* Add-ons List */}
            <div>
              <h3 className="mb-3 text-lg font-medium text-black">Add-ons</h3>
              {loading ? (
                <p className="text-sm text-gray-500">Loading add-ons...</p>
              ) : (
                <ul className="space-y-3">
                  {addons
                    // .filter((addon) =>
                    //   selectedCategory
                    //     ? addon.categoryId === selectedCategory
                    //     : true,
                    // )
                    .map((addon) => (
                      <li
                        key={addon.id}
                        className="flex items-center justify-between rounded-lg border border-stroke px-5 py-3"
                      >
                        <span className="text-black">
                          {addon.name} (
                          {categories.find((cat) => cat.id === addon.categoryId)
                            ?.name || "Unknown Category"}
                          )<span> - ${addon.price}</span>
                        </span>
                        <div>
                          <button
                            onClick={() => handleEditButtonClick(addon)}
                            className="rounded-lg bg-blue-500 px-3 py-2 text-white hover:bg-blue-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteAddon(addon.id)}
                            className="rounded-lg bg-red-500 px-3 py-2 text-white hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </DefaultLayout>
    </div>
  );
}
