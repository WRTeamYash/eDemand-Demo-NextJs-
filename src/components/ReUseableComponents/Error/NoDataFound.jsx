import React from "react";
import CustomImageTag from "../CustomImageTag";
import noDataFound from "../../../assets/no_data-found.svg";
import { placeholderImage } from "@/utils/Helper";

const NoDataFound = ({ title, desc }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 max-w-3xl">
      <CustomImageTag
        width={0}
        height={0}
        src={noDataFound?.src}
        alt="noDataFound"
        className="h-[350px] w-full object-contain"
        onError={placeholderImage}
      />
      <div className="text-center">

      <h1 className="text-3xl">{title}</h1>
      <p className="text-sm">{desc}</p>
      </div>
    </div>
  );
};

export default NoDataFound;
