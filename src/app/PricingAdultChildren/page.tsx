"use client";
import React, { useState, useEffect } from "react";
import {
  createPricingRule,
  getAllPricingRules,
  updatePricingRule,
  deletePricingRule,
  calculateCost,
} from "../../controller/PricingRule/PricingRuleAdultChildren";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { getAllTours } from "../../controller/Tours/Tours"; // Import the function to get tours

interface Tour {
  id: string;
  name: string;
}

interface PricingRule {
  id: string;
  minAdults: number;
  maxAdults: number;
  pricePerAdult: number;
  pricePerChild: number;
  tour: Tour;
}

const PricingRuleManagement = () => {
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([]);
  const [cost, setCost] = useState<number | null>(null);
  const [adults, setAdults] = useState<number>(0);
  const [children, setChildren] = useState<number>(0);
  const [tourId, setTourId] = useState<string>("");
  const [newPricingRule, setNewPricingRule] = useState({
    tourId: "",
    minAdults: 0,
    maxAdults: 0,
    pricePerAdult: 0,
    pricePerChild: 0,
  });
  const [editPricingRule, setEditPricingRule] = useState<PricingRule | null>(
    null,
  );

  const [tours, setTours] = useState<Tour[]>([]); // State to hold the tours

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const fetchedTours = await getAllTours();
        const transformedTours = fetchedTours.data.map((tour) => ({
          ...tour,
          id: tour.id?.toString() || "", // Transform id to string, or fallback to an empty string
        }));
        setTours(transformedTours);
      } catch (error) {
        console.error("Error fetching tours:", error);
      }
    };

    fetchTours();
  }, []);

  useEffect(() => {
    const fetchPricingRules = async () => {
      try {
        const fetchedPricingRules = await getAllPricingRules();
        console.log(fetchedPricingRules, "fetchedPricingRules");
        setPricingRules(fetchedPricingRules); // Directly set pricingRules
      } catch (error) {
        console.error("Error fetching pricing rules:", error);
      }
    };

    fetchPricingRules();
  }, []);

  // Handle the cost calculation
  const handleCalculateCost = async () => {
    try {
      const result = await calculateCost({ adults, children, tourId });
      console.log(result.data, "result");
      setCost(result.data.totalCost);
    } catch (error) {
      console.error(error);
    }
  };

  // Handle creating a new pricing rule
  const handleCreatePricingRule = async () => {
    try {
      const result = await createPricingRule(newPricingRule);
      setPricingRules((prevRules) => [...prevRules, result]);
      setNewPricingRule({
        tourId: "",
        minAdults: 0,
        maxAdults: 0,
        pricePerAdult: 0,
        pricePerChild: 0,
      });
    } catch (error) {
      console.error(error);
    }
  };

  // Handle updating an existing pricing rule
  const handleUpdatePricingRule = async () => {
    if (editPricingRule) {
      try {
        const updatedRule = {
          minAdults: editPricingRule.minAdults,
          maxAdults: editPricingRule.maxAdults,
          pricePerAdult: editPricingRule.pricePerAdult,
          pricePerChild: editPricingRule.pricePerChild,
        };
        const updatedPricingRule = await updatePricingRule(
          editPricingRule.id,
          updatedRule,
        );
        setPricingRules((prevRules) =>
          prevRules.map((rule) =>
            rule.id === updatedPricingRule.id ? updatedPricingRule : rule,
          ),
        );
        setEditPricingRule(null);
      } catch (error) {
        console.error(error);
      }
    }
  };

  // Handle deleting a pricing rule
  const handleDeletePricingRule = async (id: string) => {
    try {
      await deletePricingRule(id);
      setPricingRules((prevRules) =>
        prevRules.filter((rule) => rule.id !== id),
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <DefaultLayout>
        <Breadcrumb pageName="Manage Pricing Rules" />
        <div className="flex w-full justify-center">
          <div className="flex w-full max-w-[960px] flex-col gap-9 rounded-[10px] bg-white p-8 shadow-lg">
            {/* Add Pricing Rule */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-black">
                Add Pricing Rule
              </h3>
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="w-full sm:w-1/4">
                  <label
                    htmlFor="tourId"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Tour
                  </label>
                  <select
                    id="tourId"
                    value={newPricingRule.tourId}
                    onChange={(e) =>
                      setNewPricingRule({
                        ...newPricingRule,
                        tourId: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none"
                  >
                    <option value="">Select Tour</option>
                    {tours.map((tour) => (
                      <option key={tour.id} value={tour.id}>
                        {tour.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-full sm:w-1/4">
                  <label
                    htmlFor="minAdults"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Min Adults
                  </label>
                  <input
                    id="minAdults"
                    type="number"
                    value={newPricingRule.minAdults}
                    onChange={(e) =>
                      setNewPricingRule({
                        ...newPricingRule,
                        minAdults: Number(e.target.value),
                      })
                    }
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none"
                  />
                </div>

                <div className="w-full sm:w-1/4">
                  <label
                    htmlFor="maxAdults"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Max Adults
                  </label>
                  <input
                    id="maxAdults"
                    type="number"
                    value={newPricingRule.maxAdults}
                    onChange={(e) =>
                      setNewPricingRule({
                        ...newPricingRule,
                        maxAdults: Number(e.target.value),
                      })
                    }
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none"
                  />
                </div>

                <div className="w-full sm:w-1/4">
                  <label
                    htmlFor="pricePerAdult"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Price per Adult
                  </label>
                  <input
                    id="pricePerAdult"
                    type="number"
                    value={newPricingRule.pricePerAdult}
                    onChange={(e) =>
                      setNewPricingRule({
                        ...newPricingRule,
                        pricePerAdult: Number(e.target.value),
                      })
                    }
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none"
                  />
                </div>

                <div className="w-full sm:w-1/4">
                  <label
                    htmlFor="pricePerChild"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Price per Child
                  </label>
                  <input
                    id="pricePerChild"
                    type="number"
                    value={newPricingRule.pricePerChild}
                    onChange={(e) =>
                      setNewPricingRule({
                        ...newPricingRule,
                        pricePerChild: Number(e.target.value),
                      })
                    }
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none"
                  />
                </div>

                <button
                  onClick={handleCreatePricingRule}
                  className="hover:bg-primary-dark rounded-lg bg-primary py-3 text-center text-white transition sm:w-1/4"
                >
                  Add Pricing Rule
                </button>
              </div>
            </div>

            {/* Pricing Rules List */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-black">
                Existing Pricing Rules
              </h3>
              <div className="space-y-4">
                {pricingRules.map((rule) => (
                  <div
                    key={rule.id}
                    className="flex items-center justify-between rounded-lg border border-gray-300 p-4 shadow-sm"
                  >
                    <div>
                      <span className="font-medium text-black">
                        {rule?.tour?.name || "No Tour Assigned"}
                      </span>

                      <p>
                        {rule.minAdults} - {rule.maxAdults} adults
                      </p>
                      <p>
                        ${rule.pricePerAdult} per adult | ${rule.pricePerChild}{" "}
                        per child
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleDeletePricingRule(rule.id)}
                        className="text-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cost Calculation */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-black">
                Calculate Cost
              </h3>
              <div className="flex gap-4">
                <input
                  type="number"
                  value={adults}
                  onChange={(e) => setAdults(Number(e.target.value))}
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none sm:w-1/4"
                  placeholder="Adults"
                />
                <input
                  type="number"
                  value={children}
                  onChange={(e) => setChildren(Number(e.target.value))}
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none sm:w-1/4"
                  placeholder="Children"
                />
                <select
                  value={tourId}
                  onChange={(e) => {
                    setTourId(e.target.value);
                    console.log("Selected Tour ID:", e.target.value);
                  }}
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none sm:w-1/4"
                >
                  <option value="">Select Tour</option>
                  {tours.map((tour) => (
                    <option key={tour.id} value={tour.id}>
                      {tour.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleCalculateCost}
                  className="hover:bg-primary-dark rounded-lg bg-primary py-3 text-center text-white transition sm:w-1/4"
                >
                  Calculate Cost
                </button>
              </div>

              {cost !== null && (
                <div className="text-xl font-semibold">
                  <p>Total Cost: ${cost}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DefaultLayout>
    </div>
  );
};

export default PricingRuleManagement;
