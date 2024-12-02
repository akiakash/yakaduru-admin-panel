"use client";
import React, { useEffect, useState } from "react";
import {
  getAllAddOns,
  createAddOn,
  deleteAddOn,
  updateAddOn,
} from "../../controller/AddOn/AddOn";
import { fetchCategories } from "../../controller/AddOnCategory/AddOnCategory";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import {
  calculateAddOnTotal,
  SelectedAddOn,
} from "../../controller/AddOnCalculator/AddOnCalculator"; // Adjust path as necessary

export default function AddOnManagement() {
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    [],
  );
  const [addons, setAddons] = useState<
    { id: number; name: string; categoryId: number; price: number }[]
  >([]);
  const [selectedCategory, setSelectedCategory] = useState<number | string>("");
  const [newAddonName, setNewAddonName] = useState<string>("");
  const [newAddonPrice, setNewAddonPrice] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [editingAddon, setEditingAddon] = useState<{
    id: number;
    name: string;
    categoryId: number;
    price: number;
  } | null>(null);
  const [addonCounts, setAddonCounts] = useState<{ [addonId: number]: number }>(
    {},
  );
  const [addonSelection, setAddonSelection] = useState<{
    [addonId: number]: boolean;
  }>({});
  const [total, setTotal] = useState<number>(0); // State for total price

  const loadCategories = async () => {
    setLoading(true);
    const response = await fetchCategories();
    if (response.success) {
      setCategories(response.data as { id: number; name: string }[]);
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
          price: number;
        }[],
      );
    }
    setLoading(false);
  };

  const handleAddAddon = async () => {
    if (newAddonName.trim() && selectedCategory) {
      const categoryId = Number(selectedCategory);
      const response = await createAddOn({
        name: newAddonName.trim(),
        categoryId,
        price: newAddonPrice,
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
        setNewAddonPrice(0);
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
        setEditingAddon(null);
        setNewAddonName("");
        setNewAddonPrice(0);
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
      categoryId: addon.categoryId,
      price: addon.price,
    });
    setNewAddonName(addon.name);
    setNewAddonPrice(addon.price);
  };

  const handleAddonCountChange = (addonId: number, count: number) => {
    setAddonCounts((prev) => ({
      ...prev,
      [addonId]: count,
    }));
  };

  const handleAddonSelectionChange = (addonId: number) => {
    setAddonSelection((prev) => {
      const newSelection = { ...prev, [addonId]: !prev[addonId] };
      if (!newSelection[addonId]) {
        setAddonCounts((prevCounts) => {
          const { [addonId]: _, ...rest } = prevCounts;
          return rest;
        });
      }
      return newSelection;
    });
  };

  const fetchTotal = async () => {
    const selectedAddons: SelectedAddOn[] = Object.keys(addonSelection)
      .filter((addonId) => addonSelection[Number(addonId)]) // Filter selected addons
      .map((addonId) => ({
        id: Number(addonId),
        count: addonCounts[Number(addonId)] || 1, // Default to 1 if count is not set
      }));

    const response = await calculateAddOnTotal(selectedAddons);
    if (response.success && response.total !== undefined) {
      setTotal(response.total);
    } else {
      console.error(response.message);
    }
  };

  useEffect(() => {
    loadCategories();
    loadAddons();
  }, []);

  useEffect(() => {
    fetchTotal();
  }, [addonCounts, addonSelection]); // Recalculate total when add-ons or counts change

  const filteredAddons = selectedCategory
    ? addons.filter((addon) => addon.categoryId === Number(selectedCategory))
    : addons;

  return (
    <div>
      <DefaultLayout>
        <Breadcrumb pageName="Manage Add Ons" />
        <div className="flex w-full justify-center">
          <div className="flex w-full max-w-[720px] flex-col gap-9 rounded-[10px] bg-white p-10">
            {/* Add Add-on */}

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

            {/* Categories with Add-ons */}
            <div>
              <h3 className="mb-3 text-lg font-medium text-black">Add-ons</h3>
              {loading ? (
                <p className="text-sm text-gray-500">Loading add-ons...</p>
              ) : (
                categories.map((category) => (
                  <div key={category.id}>
                    <h4 className="text-md font-medium text-black">
                      {category.name}
                    </h4>
                    <ul className="space-y-3">
                      {filteredAddons
                        .filter((addon) => addon.categoryId === category.id)
                        .map((addon) => (
                          <li
                            key={addon.id}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={addonSelection[addon.id] || false}
                                onChange={() =>
                                  handleAddonSelectionChange(addon.id)
                                }
                                className="form-checkbox"
                              />
                              <span className="text-black">{addon.name}</span>
                              <span className="text-black">${addon.price}</span>
                              {addonSelection[addon.id] && (
                                <input
                                  type="number"
                                  value={addonCounts[addon.id] || 1}
                                  onChange={(e) =>
                                    handleAddonCountChange(
                                      addon.id,
                                      Number(e.target.value),
                                    )
                                  }
                                  className="ml-2 w-12 rounded border-gray-300"
                                />
                              )}
                            </div>
                          </li>
                        ))}
                    </ul>
                  </div>
                ))
              )}
            </div>
            <div>
              <h3 className="mt-3 text-xl font-medium text-black">
                Total: ${total}
              </h3>
            </div>
          </div>
        </div>
      </DefaultLayout>
    </div>
  );
}
