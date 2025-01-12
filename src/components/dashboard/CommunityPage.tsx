"use client";

import { useState } from "react";
import { FrontendIdDisplay } from "@/components/dashboard/FrontendIdDisplay";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

const CommunityPage = () => {
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Dummy data
  const dummyDownlineData = {
    downlineAddresses: Array.from({ length: 5 }, (_, i) => `0xAddress${i + 1}`),
    sponsorAddresses: Array.from({ length: 5 }, (_, i) => `0xSponsor${i + 1}`),
    directReferralsCount: Array.from({ length: 5 }, () =>
      Math.floor(Math.random() * 10)
    ),
    currentLevels: Array.from(
      { length: 5 },
      () => Math.floor(Math.random() * 5) + 1
    ),
    totalCount: 5,
  };

  const downlineData = dummyDownlineData;

  return (
    <div className="w-full">
      <div className="p-4 rounded-lg drop-shadow-lg shadow bg-gradient w-full">
        <div className="flex justify-start gap-4 overflow-x-auto">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((level) => (
            <button
              type="button"
              key={level}
              onClick={() => {
                setSelectedLevel(level);
                setCurrentPage(1);
              }}
              className={`py-2 px-6 rounded bg-gradient-button text-white ${
                selectedLevel === level ? "opacity-100 " : "opacity-50"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <section className="mt-4 p-4 rounded-lg drop-shadow-lg shadow bg-gradient">
        <div className="overflow-y-auto text-nowrap pb-1">
          <table className="w-full mt-4 border-collapse">
            <thead className="overflow-y-auto drop-shadow-lg bg-white/40 dark:bg-white/5">
              <tr>
                <th className="py-2 px-4 text-left">S.No.</th>
                <th className="py-2 px-4 text-left">Address</th>
                <th className="py-2 px-4 text-left">Sponsor</th>
                <th className="py-2 px-4 text-left">Direct Referral</th>
                <th className="py-2 px-4 text-left">Current Levels</th>
              </tr>
            </thead>
            <tbody>
              {downlineData.downlineAddresses.map((address, index) => (
                <tr
                  key={`${index + 1}`}
                  className="hover:bg-white/20 dark:hover:bg-white/10"
                >
                  <td className="py-2 px-8 text-left">{index + 1}</td>
                  <td className="py-2 px-4 text-left">
                    {/* <FrontendIdDisplay address={address} isRegistered={currentLevel > 0} /> */}
                  </td>
                  <td className="py-2 px-4 text-left">
                    <FrontendIdDisplay
                      address={downlineData.sponsorAddresses[index]}
                      isRegistered={true}
                    />
                  </td>
                  <td className="py-2 px-16 text-left">
                    {downlineData.directReferralsCount[0]}
                  </td>
                  <td className="py-2 px-16 text-left">
                    {downlineData.currentLevels[0]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {downlineData.downlineAddresses.length === 0 && (
            <p className="text-gray-500 text-center mt-4">
              No downline data available for this level.
            </p>
          )}

          <div className="flex justify-between items-center mt-4 gap-4 w-full">
            <div className="text-sm text-gray-500 w-full">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, downlineData.totalCount)} of{" "}
              {downlineData.totalCount} entries
            </div>
            <div className="flex justify-end gap-1 lg:gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded drop-shadow shadow ${
                  currentPage === 1
                    ? "bg-gray-300 text-gray-600 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed"
                    : "bg-gray-200 text-gray-500 dark:bg-gray-600 dark:text-gray-300 hover:bg-opacity-80 dark:hover:bg-opacity-80"
                }`}
              >
                <LuChevronLeft className="h-4 w-4" />
              </button>
              <div className="px-3 py-1 rounded drop-shadow shadow bg-gradient-button text-white">
                {currentPage} of{" "}
                {Math.ceil(downlineData.totalCount / itemsPerPage)}
              </div>
              <button
                type="button"
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(
                      prev + 1,
                      Math.ceil(downlineData.totalCount / itemsPerPage)
                    )
                  )
                }
                disabled={
                  currentPage ===
                  Math.ceil(downlineData.totalCount / itemsPerPage)
                }
                className={`px-3 py-1 rounded drop-shadow shadow ${
                  currentPage ===
                  Math.ceil(downlineData.totalCount / itemsPerPage)
                    ? "bg-gray-300 text-gray-600 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed"
                    : "bg-gray-200 text-gray-500 dark:bg-gray-600 dark:text-gray-300 hover:bg-opacity-80 dark:hover:bg-opacity-80"
                }`}
              >
                <LuChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CommunityPage;
