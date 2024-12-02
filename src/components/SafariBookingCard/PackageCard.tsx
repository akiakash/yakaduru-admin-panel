"use client";
import { deleteTour, fetchTours } from "@/controller/safari/Safari";
import Image from "next/image";
import React, { useState } from "react";

type PackageCardProps = {
  packages: PackageData[];
  onDelete: (id: string) => void;
  openModal: (id: string) => void;
};

type SectionDetails = {
  section: string;
  details: string[];
};

type PackageData = {
  name: string;
  price: number;
  overview: string[]; // Changed to string[] for array of strings
  includes: string[]; // Changed to string[] for array of strings
  expectations: string[]; // Changed to string[] for array of strings
  image: string[];
  id: string;
};

const PackageCard: React.FC<PackageCardProps> = ({
  packages,
  onDelete,
  openModal,
}) => {
  const [expandedSection, setExpandedSection] = useState<number | null>(null);
  const [expandedIncludes, setExpandedIncludes] = useState<number | null>(null);
  const [expandedExpectations, setExpandedExpectations] = useState<
    number | null
  >(null);
  const [updatedPackages, setUpdatedPackages] =
    useState<PackageData[]>(packages);
  const toggleOverview = (sectionIndex: number) => {
    setExpandedSection((prev) => (prev === sectionIndex ? null : sectionIndex));
  };
  const toggleIncludes = (sectionIndex: number) => {
    setExpandedIncludes((prev) =>
      prev === sectionIndex ? null : sectionIndex,
    );
  };

  const toggleExpectations = (sectionIndex: number) => {
    setExpandedExpectations((prev) =>
      prev === sectionIndex ? null : sectionIndex,
    );
  };

  return (
    <div className="flex w-full max-w-[1160px] flex-col gap-10">
      {packages.map((pkg, cardIndex) => (
        <section
          key={cardIndex}
          className="mb-4 flex  w-full max-w-[1160px] flex-row gap-2 border-[1px]  border-[#C9C5BA]"
        >
          {/* Left Section - Image */}
          {/* <div className="max-w-[379px]">
            <Image
              src="{pkg.image}"
              width={379}
              height={240}
              alt={pkg.name}
              className="h-full min-h-[428px] w-full object-cover"
            />
          </div> */}

          {/* Right Section - Content */}
          <div className="flex h-full w-full flex-col justify-between">
            <div className="w-full p-4">
              <div className="flex w-full flex-row items-center justify-between">
                <h1 className="text-[40px] font-normal leading-[54.44px] text-[#000]">
                  {pkg.name}
                </h1>
                <div className="flex flex-col">
                  <span className="text-[12px] font-normal leading-[14.44px] text-[#000]">
                    Starts from
                  </span>
                  <h2 className="text-[24px] font-normal leading-[32.44px] text-[#000]">
                    {pkg.price}
                  </h2>
                  <span className="text-[12px] font-normal leading-[14.44px] text-[#000]">
                    Price varies by group size
                  </span>
                </div>
              </div>
              <hr className="my-3 border-[0.5px] border-[#C9C5BA]" />

              {/* <div className="">
                <div className="flex cursor-pointer flex-row justify-between">
                  <h1 className="font-[Lato] text-[14px] font-semibold leading-[25px] text-[#000]">
                    OverView
                  </h1>
                  <span>
                    <svg
                      width="20"
                      height="21"
                      viewBox="0 0 20 21"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.83293 12.8583C5.98906 13.0135 6.20027 13.1006 6.42043 13.1006C6.64058 13.1006 6.85179 13.0135 7.00793 12.8583L9.9996 9.90826L12.9496 12.8583C13.1057 13.0135 13.3169 13.1006 13.5371 13.1006C13.7573 13.1006 13.9685 13.0135 14.1246 12.8583C14.2027 12.7808 14.2647 12.6886 14.307 12.5871C14.3493 12.4855 14.3711 12.3766 14.3711 12.2666C14.3711 12.1566 14.3493 12.0477 14.307 11.9461C14.2647 11.8446 14.2027 11.7524 14.1246 11.6749L10.5913 8.14159C10.5138 8.06349 10.4216 8.00149 10.3201 7.95918C10.2185 7.91688 10.1096 7.89509 9.9996 7.89509C9.88959 7.89509 9.78066 7.91688 9.67911 7.95918C9.57756 8.00149 9.4854 8.06349 9.40793 8.14159L5.83293 11.6749C5.75482 11.7524 5.69283 11.8446 5.65052 11.9461C5.60821 12.0477 5.58643 12.1566 5.58643 12.2666C5.58643 12.3766 5.60821 12.4855 5.65052 12.5871C5.69283 12.6886 5.75482 12.7808 5.83293 12.8583Z"
                        fill="#000"
                      />
                    </svg>
                  </span>
                </div>
                <div> {pkg.overview}</div>
                <hr className="my-3 border-[0.5px] border-[#C9C5BA]" />
              </div> */}
              <div>
                <div className="">
                  <div
                    className="flex cursor-pointer flex-row justify-between"
                    onClick={() => toggleOverview(cardIndex)} // Toggle on click
                  >
                    <h1 className="font-[Lato] text-[14px] font-semibold leading-[25px] text-[#000]">
                      OverView
                    </h1>
                    <span>
                      <svg
                        width="20"
                        height="21"
                        viewBox="0 0 20 21"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5.83293 12.8583C5.98906 13.0135 6.20027 13.1006 6.42043 13.1006C6.64058 13.1006 6.85179 13.0135 7.00793 12.8583L9.9996 9.90826L12.9496 12.8583C13.1057 13.0135 13.3169 13.1006 13.5371 13.1006C13.7573 13.1006 13.9685 13.0135 14.1246 12.8583C14.2027 12.7808 14.2647 12.6886 14.307 12.5871C14.3493 12.4855 14.3711 12.3766 14.3711 12.2666C14.3711 12.1566 14.3493 12.0477 14.307 11.9461C14.2647 11.8446 14.2027 11.7524 14.1246 11.6749L10.5913 8.14159C10.5138 8.06349 10.4216 8.00149 10.3201 7.95918C10.2185 7.91688 10.1096 7.89509 9.9996 7.89509C9.88959 7.89509 9.78066 7.91688 9.67911 7.95918C9.57756 8.00149 9.4854 8.06349 9.40793 8.14159L5.83293 11.6749C5.75482 11.7524 5.69283 11.8446 5.65052 11.9461C5.60821 12.0477 5.58643 12.1566 5.58643 12.2666C5.58643 12.3766 5.60821 12.4855 5.65052 12.5871C5.69283 12.6886 5.75482 12.7808 5.83293 12.8583Z"
                          fill="#000"
                        />
                      </svg>
                    </span>
                  </div>
                </div>

                {/* Conditionally render the Overview section */}
                {expandedSection === cardIndex && (
                  <div>
                    <ul className="list-disc space-y-2 pl-5">
                      {pkg.overview.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <hr className="my-3 border-[0.5px] border-[#C9C5BA]" />
              <div>
                <div className="">
                  <div
                    className="flex cursor-pointer flex-row justify-between"
                    onClick={() => toggleIncludes(cardIndex)} // Toggle on click
                  >
                    <h1 className="font-[Lato] text-[14px] font-semibold leading-[25px] text-[#000]">
                      Includes
                    </h1>
                    <span>
                      <svg
                        width="20"
                        height="21"
                        viewBox="0 0 20 21"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5.83293 12.8583C5.98906 13.0135 6.20027 13.1006 6.42043 13.1006C6.64058 13.1006 6.85179 13.0135 7.00793 12.8583L9.9996 9.90826L12.9496 12.8583C13.1057 13.0135 13.3169 13.1006 13.5371 13.1006C13.7573 13.1006 13.9685 13.0135 14.1246 12.8583C14.2027 12.7808 14.2647 12.6886 14.307 12.5871C14.3493 12.4855 14.3711 12.3766 14.3711 12.2666C14.3711 12.1566 14.3493 12.0477 14.307 11.9461C14.2647 11.8446 14.2027 11.7524 14.1246 11.6749L10.5913 8.14159C10.5138 8.06349 10.4216 8.00149 10.3201 7.95918C10.2185 7.91688 10.1096 7.89509 9.9996 7.89509C9.88959 7.89509 9.78066 7.91688 9.67911 7.95918C9.57756 8.00149 9.4854 8.06349 9.40793 8.14159L5.83293 11.6749C5.75482 11.7524 5.69283 11.8446 5.65052 11.9461C5.60821 12.0477 5.58643 12.1566 5.58643 12.2666C5.58643 12.3766 5.60821 12.4855 5.65052 12.5871C5.69283 12.6886 5.75482 12.7808 5.83293 12.8583Z"
                          fill="#000"
                        />
                      </svg>
                    </span>
                  </div>
                </div>

                {/* Conditionally render the Overview section */}
                {expandedIncludes === cardIndex && (
                  <div>
                    {" "}
                    <ul className="list-disc space-y-2 pl-5">
                      {pkg.includes.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <hr className="my-3 border-[0.5px] border-[#C9C5BA]" />
              <div>
                <div className="">
                  <div
                    className="flex cursor-pointer flex-row justify-between"
                    onClick={() => toggleExpectations(cardIndex)} // Toggle on click
                  >
                    <h1 className="font-[Lato] text-[14px] font-semibold leading-[25px] text-[#000]">
                      Expectation
                    </h1>
                    <span>
                      <svg
                        width="20"
                        height="21"
                        viewBox="0 0 20 21"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5.83293 12.8583C5.98906 13.0135 6.20027 13.1006 6.42043 13.1006C6.64058 13.1006 6.85179 13.0135 7.00793 12.8583L9.9996 9.90826L12.9496 12.8583C13.1057 13.0135 13.3169 13.1006 13.5371 13.1006C13.7573 13.1006 13.9685 13.0135 14.1246 12.8583C14.2027 12.7808 14.2647 12.6886 14.307 12.5871C14.3493 12.4855 14.3711 12.3766 14.3711 12.2666C14.3711 12.1566 14.3493 12.0477 14.307 11.9461C14.2647 11.8446 14.2027 11.7524 14.1246 11.6749L10.5913 8.14159C10.5138 8.06349 10.4216 8.00149 10.3201 7.95918C10.2185 7.91688 10.1096 7.89509 9.9996 7.89509C9.88959 7.89509 9.78066 7.91688 9.67911 7.95918C9.57756 8.00149 9.4854 8.06349 9.40793 8.14159L5.83293 11.6749C5.75482 11.7524 5.69283 11.8446 5.65052 11.9461C5.60821 12.0477 5.58643 12.1566 5.58643 12.2666C5.58643 12.3766 5.60821 12.4855 5.65052 12.5871C5.69283 12.6886 5.75482 12.7808 5.83293 12.8583Z"
                          fill="#000"
                        />
                      </svg>
                    </span>
                  </div>
                </div>

                {/* Conditionally render the Overview section */}
                {expandedExpectations === cardIndex && (
                  <div>
                    {" "}
                    <ul className="list-disc space-y-2 pl-5">
                      {pkg.expectations.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex w-full flex-row items-end justify-end gap-10 p-4">
              <button
                onClick={() => openModal(pkg.id)}
                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 disabled:opacity-50"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(pkg.id)}
                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
};

export default PackageCard;
