import React from "react";
import { useRTL } from "@/utils/Helper";

const CategoryLoop = ({ categoryData }) => {
  const repeatedData = Array(1).fill(categoryData).flat();
  const isRTL = useRTL();

  const renderContent = () =>
    repeatedData.map((ele, index) => (
      <div
        className={`flex items-center px-4 ${isRTL ? "flex-row-reverse" : ""}`}
        key={index}
      >
        <span className="text-md md:text-xl leading-5 font-bold whitespace-nowrap">
          {ele?.name}
        </span>
        {/* The star div */}
        <div className="clip-star w-4 h-4 bg-white dark:bg-black ml-6" />
      </div>
    ));

  return (
    <div className="overflow-hidden">
      <div className="flex items-center w-max ltr-slide rtl:rtl-slide bg-black text-white dark:bg-white dark:text-black p-2 h-[80px] font-bold">
        {renderContent()}
        {renderContent()}
      </div>
    </div>
  );
};

export default CategoryLoop;
