import React from "react";
import { PiSpinnerBold } from "react-icons/pi";

const Loading = () => {
  return (
    <div className="flex justify-center items-center w-full min-h-screen">
      <PiSpinnerBold className="animate-spin text-2xl lg:text-4xl" />
    </div>
  );
};

export default Loading;
