"use client";

import React from "react";
import { FrontendIdDisplay } from "./FrontendIdDisplay";

const GeneologyPage = () => {
  const address = "0xAddress1";

  // Dummy data for state
  const state = {
    currentDepth: 3,
    currentAddress: "0xAddress1",
    downlines: ["0xAddress2", "0xAddress3", "0xAddress4"],
    loading: false,
  };

  const handleAddressClick = (address: string) => {
    console.log("Clicked address:", address);
  };

  return (
    <div className="p-4 rounded-lg drop-shadow-lg shadow bg-gradient w-full">
      <div className="text-center mb-4">
        <span className="px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900 text-lg lg:text-xl font-semibold">
          Depth Level: {state.currentDepth}
        </span>
      </div>
      <div
        className={`flex lg:justify-center items-center w-full py-4 overflow-x-auto ${
          state.downlines.length > 1
            ? "justify-start lg:justify-center"
            : "justify-center"
        }`}
      >
        <div className="flex flex-col items-center">
          {/* Current Address */}
          <div>
            <button
              type="button"
              onClick={() =>
                address &&
                state.currentAddress !== address &&
                handleAddressClick(address)
              }
              className={`p-4 rounded-lg transition-all duration-200 backdrop-blur-lg shadow-md hover:shadow-lg ${
                state.currentAddress === address
                  ? "bg-white/40 dark:bg-white/5"
                  : "bg-white/40 dark:bg-white/5"
              }`}
            >
              <FrontendIdDisplay
                address={state.currentAddress}
                isRegistered={true}
              />
            </button>
          </div>

          {/* Connecting Line */}
          {state.downlines.length > 0 && (
            <div className="w-1 h-8 bg-gradient-to-t from-pink via-purple to-blue" />
          )}

          {/* Downline Addresses */}
          <div className="flex justify-center items-center w-full">
            {state.loading ? (
              <div className="flex items-center justify-center py-4">
                <span className="inline-block w-8 h-8 border-2 border-t-transparent border-blue-500 rounded-full animate-spin" />
              </div>
            ) : (
              state.downlines.map((downlineAddress, index) => (
                <div
                  key={downlineAddress}
                  className="flex flex-col justify-center items-center"
                >
                  {state.downlines.length > 1 && (
                    <div
                      className={`relative h-1 bg-gradient-to-t from-pink via-purple to-blue  ${
                        index === 0
                          ? "w-[51%] ml-auto"
                          : index === state.downlines.length - 1
                          ? "w-[51%] mr-auto"
                          : "w-full"
                      }`}
                    />
                  )}
                  <div className="w-1 h-8 bg-gradient-to-t from-pink via-purple to-blue" />
                  <button
                    type="button"
                    onClick={() => handleAddressClick(downlineAddress)}
                    className="p-4 mx-4 lg:mx-8 rounded-lg transition-all duration-200 bg-white/40 dark:bg-white/5 
                    backdrop-blur-lg shadow-md hover:shadow-lg hover:bg-blue-50 dark:hover:bg-blue-900/50"
                  >
                    <FrontendIdDisplay
                      address={downlineAddress}
                      isRegistered={true}
                    />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneologyPage;
