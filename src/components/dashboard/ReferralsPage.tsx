"use client";

import React, { useState } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

const ReferralsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // dummy data
  const referralData = {
    referralData: [
      {
        userAddress: "0xAddress1",
        activationTime: 1622557891,
        currentLevel: 1,
        directReferrals: 5,
      },
      {
        userAddress: "0xAddress2",
        activationTime: 1622644291,
        currentLevel: 2,
        directReferrals: 3,
      },
    ],
    totalCount: 2,
  };

  const LEVELS = [
    { name: "Beginner" },
    { name: "Intermediate" },
    { name: "Advanced" },
  ];

  return (
    <div className="p-4 rounded-lg drop-shadow-lg shadow bg-gradient w-full">
      <div className="overflow-y-auto text-nowrap pb-1">
        <table className="w-full">
          <thead className="overflow-y-auto drop-shadow-lg bg-white/40 dark:bg-white/5">
            <tr>
              <th className="py-2 px-4 text-left">S.No</th>
              <th className="py-2 px-4 text-left">Address</th>
              <th className="py-2 px-4 text-left">Activation Date</th>
              <th className="py-2 px-4 text-left">Level</th>
              <th className="py-2 px-4 text-left">Direct Team</th>
            </tr>
          </thead>
          <tbody>
            {referralData.referralData.map((referral, index) => (
              <tr
                key={`referral-${index + 1}`}
                className="hover:bg-white/20 dark:hover:bg-white/10"
              >
                <td className="py-2 px-4">{index + 1}</td>
                <td className="py-2 px-4">
                  {/* <FrontendIdDisplay address={referral.userAddress} isRegistered={referral.currentLevel > 0} /> */}
                </td>
                <td className="py-2 px-4">
                  {new Date(
                    referral.activationTime * 1000
                  ).toLocaleDateString()}
                </td>
                <td className="py-2 px-4">
                  {LEVELS[referral.currentLevel - 1]?.name ||
                    `Level ${referral.currentLevel}`}
                </td>
                <td className="py-2 px-4">{referral.directReferrals}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {referralData.referralData.length === 0 && (
          <p className="text-gray-500 text-center mt-4">
            No referral data available.
          </p>
        )}
        <div className="flex justify-between items-center gap-8 mt-4 w-full text-nowrap">
          <div className="text-sm text-gray-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, referralData.totalCount)} of{" "}
            {referralData.totalCount} entries
          </div>
          <div className="flex justify-end gap-2">
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
            <div className="px-3 py-1 rounded bg-gradient-button text-white">
              {currentPage} of{" "}
              {Math.ceil(referralData.totalCount / itemsPerPage)}
            </div>
            <button
              type="button"
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(
                    prev + 1,
                    Math.ceil(referralData.totalCount / itemsPerPage)
                  )
                )
              }
              disabled={
                currentPage ===
                Math.ceil(referralData.totalCount / itemsPerPage)
              }
              className={`px-3 py-1 rounded drop-shadow shadow ${
                currentPage ===
                Math.ceil(referralData.totalCount / itemsPerPage)
                  ? "bg-gray-300 text-gray-600 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed"
                  : "bg-gray-200 text-gray-500 dark:bg-gray-600 dark:text-gray-300 hover:bg-opacity-80 dark:hover:bg-opacity-80"
              }`}
            >
              <LuChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralsPage;
