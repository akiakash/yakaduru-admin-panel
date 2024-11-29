"use client";
import { fetchCategories } from "@/controller/Categories/Categories";
import React, { useState, useEffect, useRef } from "react";

interface Option {
  value: string;
  text: string;
  selected: boolean;
  element?: HTMLElement;
}

interface DropdownProps {
  id: string;
  selectedCategories: string[]; // Array of selected category IDs passed from parent
  onSelect: (selectedValues: string[]) => void; // Callback to pass selected values
}

const CategoryMultiSelect: React.FC<DropdownProps> = ({
  id,
  selectedCategories,
  onSelect,
}) => {
  const [options, setOptions] = useState<Option[]>([]);
  const [show, setShow] = useState(false);
  const dropdownRef = useRef<any>(null);
  const trigger = useRef<any>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetchCategories(); // Fetch categories from API
        console.log(response, "categories response");

        if (response?.success && Array.isArray(response.data)) {
          const newOptions = response.data.map((category: any) => ({
            value: category.id.toString(),
            text: category.name,
            selected: selectedCategories.includes(category.id.toString()), // Check if the category is selected
          }));
          setOptions(newOptions);
        } else {
          console.error("Unexpected response structure:", response);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    loadCategories(); // Call the function when the component mounts
  }, [selectedCategories]); // Reload categories if selectedCategories change

  const open = () => {
    setShow(true);
  };

  const isOpen = () => {
    return show === true;
  };

  const select = (index: number, event: React.MouseEvent) => {
    const newOptions = [...options];

    newOptions[index].selected = !newOptions[index].selected; // Toggle selected state

    setOptions(newOptions);
    const newSelectedValues = newOptions
      .filter((option) => option.selected)
      .map((option) => option.value);

    onSelect(newSelectedValues); // Pass the selected values back to the parent
  };

  const remove = (index: number) => {
    const newOptions = [...options];
    newOptions[index].selected = false;

    setOptions(newOptions);
    const newSelectedValues = newOptions
      .filter((option) => option.selected)
      .map((option) => option.value);

    onSelect(newSelectedValues); // Pass the updated selected values to the parent
  };

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (
        !show ||
        dropdownRef.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setShow(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  return (
    <div className="relative">
      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
        Select Categories
      </label>
      <div>
        <div className="z-50 flex flex-col items-center">
          <input
            name="values"
            type="hidden"
            defaultValue={selectedCategories.join(",")}
          />
          <div className="relative z-50 inline-block w-full">
            <div className="relative flex flex-col items-center">
              <div ref={trigger} onClick={open} className="w-full">
                <div className="mb-2 flex rounded border border-stroke py-2 pl-3 pr-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
                  <div className="flex flex-auto flex-wrap gap-3">
                    {options
                      .filter((option) => option.selected)
                      .map((option, index) => (
                        <div
                          key={index}
                          className="my-1.5 flex items-center justify-center rounded border-[.5px] border-stroke bg-gray px-2.5 py-1.5 text-sm font-medium dark:border-strokedark dark:bg-white/30"
                        >
                          <div className="max-w-full flex-initial">
                            {option.text}
                          </div>
                          <div className="flex flex-auto flex-row-reverse">
                            <div
                              onClick={() => remove(index)}
                              className="cursor-pointer pl-2 hover:text-danger"
                            >
                              <svg
                                className="fill-current"
                                role="button"
                                width="12"
                                height="12"
                                viewBox="0 0 12 12"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M9.35355 3.35355C9.54882 3.15829 9.54882 2.84171 9.35355 2.64645C9.15829 2.45118 8.84171 2.45118 8.64645 2.64645L6 5.29289L3.35355 2.64645C3.15829 2.45118 2.84171 2.45118 2.64645 2.64645C2.45118 2.84171 2.45118 3.15829 2.64645 3.35355L5.29289 6L2.64645 8.64645C2.45118 8.84171 2.45118 9.15829 2.64645 9.35355C2.84171 9.54882 3.15829 9.54882 3.35355 9.35355L6 6.70711L8.64645 9.35355C8.84171 9.54882 9.15829 9.54882 9.35355 9.35355C9.54882 9.15829 9.54882 8.84171 9.35355 8.64645L6.70711 6L9.35355 3.35355Z"
                                  fill="currentColor"
                                ></path>
                              </svg>
                            </div>
                          </div>
                        </div>
                      ))}
                    {options.every((option) => !option.selected) && (
                      <div className="flex-1">
                        <input
                          placeholder="Select an option"
                          className="h-full w-full appearance-none bg-transparent p-1 px-2 outline-none"
                          defaultValue={selectedCategories.join(",")}
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex w-8 items-center py-1 pl-1 pr-1">
                    <button
                      type="button"
                      onClick={open}
                      className="h-6 w-6 cursor-pointer outline-none focus:outline-none"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.8">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                            fill="#637381"
                          ></path>
                        </g>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div className="w-full px-4">
                <div
                  className={`max-h-select absolute left-0 top-full z-40 w-full overflow-y-auto rounded bg-white shadow dark:bg-form-input ${
                    isOpen() ? "" : "hidden"
                  }`}
                  ref={dropdownRef}
                  onFocus={() => setShow(true)}
                  onBlur={() => setShow(false)}
                >
                  <div className="flex w-full flex-col">
                    {options.map((option, index) => (
                      <div key={index}>
                        <div
                          className={`cursor-pointer border-b border-stroke bg-gray py-2 pl-4 pr-4 text-sm font-medium text-black hover:bg-primary hover:text-white dark:border-strokedark dark:bg-white/30 dark:text-white ${
                            option.selected ? "bg-primary text-white" : ""
                          }`}
                          onClick={(e) => select(index, e)}
                        >
                          {option.text}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryMultiSelect;
