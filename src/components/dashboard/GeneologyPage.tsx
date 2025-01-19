"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAccount } from "wagmi";
import { fetchGenealogyData, setCurrentAddress, setCurrentDepth } from "@/store/features/genealogySlice";
import type { AppDispatch, RootState } from "@/store";
import { FrontendIdDisplay } from "./FrontendIdDisplay";

const GeneologyPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { address } = useAccount();
  const { currentAddress, downlines, currentDepth, isLoading } = useSelector(
    (state: RootState) => state.genealogy
  );

  useEffect(() => {
    if (address) {
      dispatch(setCurrentAddress(address));
      dispatch(fetchGenealogyData(address));
    }
  }, [address, dispatch]);

  const handleAddressClick = (clickedAddress: string) => {
    if (!clickedAddress || !address) return;
    
    dispatch(setCurrentAddress(clickedAddress));
    dispatch(setCurrentDepth(clickedAddress === address ? 1 : currentDepth + 1));
    dispatch(fetchGenealogyData(clickedAddress));
  };

  if (!currentAddress) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="p-4 rounded-lg drop-shadow-lg shadow bg-light-gradient dark:bg-dark-gradient w-full">
      {/* <div className="text-center mb-4">
        <span className="px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900 text-lg lg:text-xl font-semibold">
          Depth Level: {currentDepth}
        </span>
      </div> */}

      <div className={`flex lg:justify-center items-center w-full py-4 overflow-x-auto ${downlines.length > 1 ? 'justify-start lg:justify-center' : 'justify-center'}`}>
        <div className="flex flex-col items-center">
          {/* Current Address */}
          <div>
            <button
              type="button"
              onClick={() => address && currentAddress !== address && handleAddressClick(address)}
              className={`p-4 rounded-lg transition-all duration-200 
                ${currentAddress === address ? 'bg-white/40 dark:bg-white/5' : 'bg-white/40 dark:bg-white/5'}
                backdrop-blur-lg shadow-md hover:shadow-lg`}
            >
              <FrontendIdDisplay address={currentAddress} isRegistered={true} />
            </button>
          </div>

          {/* Connecting Line */}
          {downlines.length > 0 && (
            <div className="w-1 h-8 bg-gradient-to-t from-pink via-purple to-blue" />
          )}

          {/* Downline Addresses */}
          <div className="flex justify-center items-center w-full">
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <span className="inline-block w-8 h-8 border-2 border-t-transparent border-blue-500 rounded-full animate-spin" />
              </div>
            ) : (
              downlines.map((downlineAddress, index) => (
                <div key={downlineAddress} className="flex flex-col justify-center items-center">
                  {downlines.length > 1 && (
                    <div className={`relative h-1 bg-gradient-to-t from-pink via-purple to-blue 
                      ${index === 0 ? "w-[51%] ml-auto" : 
                        index === downlines.length - 1 ? "w-[51%] mr-auto" : "w-full"}`} 
                    />
                  )}
                  <div className="w-1 h-8 bg-gradient-to-t from-pink via-purple to-blue" />
                  <button
                    type="button"
                    onClick={() => handleAddressClick(downlineAddress)}
                    className="p-4 mx-4 lg:mx-8 rounded-lg transition-all duration-200 bg-white/40 dark:bg-white/5 
                      backdrop-blur-lg shadow-md hover:shadow-lg hover:bg-blue-50 dark:hover:bg-blue-900/50"
                  >
                    <FrontendIdDisplay address={downlineAddress} isRegistered={true} />
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
