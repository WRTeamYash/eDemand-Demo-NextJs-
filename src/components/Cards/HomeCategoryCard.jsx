"use client";
import { placeholderImage, useRTL } from "@/utils/Helper";
import React from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import CustomImageTag from "../ReUseableComponents/CustomImageTag";
import { useTranslation } from "../Layout/TranslationContext";

const HomeCategoryCard = ({ data, handleRouteCategory }) => {
  const t = useTranslation();
  const isRTL = useRTL();

  const hexToRgb = (hex) => {
    // Remove the "#" at the start of the hex if it's there
    hex = hex.replace(/^#/, "");

    // Convert hex to RGB
    let r = parseInt(hex.substr(0, 2), 16);
    let g = parseInt(hex.substr(2, 2), 16);
    let b = parseInt(hex.substr(4, 2), 16);

    return `rgba(${r}, ${g}, ${b},0.4)`;
  };

  const primaryColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--primary-color")
    .trim();
  const rgbPrimaryColor = hexToRgb(primaryColor);


  return (
    <div
      className="relative border border-transparent custom-shadow card_bg px-[18px] py-[24px] rounded-[16px] flex items-center justify-start gap-4 group hover:border_color cursor-pointer"
      onClick={() => handleRouteCategory(data)}
    >
      {/* Icon/Image Container */}
      <div
        className="primary_bg_color h-[54px] w-[54px] rounded-full flex items-center justify-center border border_color group-hover:scale-125 transition-transform duration-500"
        style={{
          boxShadow: `0px 8px 12px 0px ${rgbPrimaryColor}`,
        }}
      >
        <CustomImageTag
          src={data?.category_image}
          alt={data?.name}
          width={0}
          height={0}
          className="w-8 h-8 rounded-full transform transition-transform duration-200 hover:scale-110"
          onError={placeholderImage}
        />
      </div>

      {/* Content Section */}
      <div className="relative flex flex-col items-start justify-start gap-1">
        <span className="text-lg font-semibold line-clamp-1">{data?.name}</span>

        {/* Provider Count / View More Section */}
        <div className="relative h-[20px] overflow-hidden flex flex-col">
          {" "}
          {/* Set a fixed height to avoid layout shift */}
          <span className="text-base font-normal description_color dark:text-white group-hover:mt-12 transition-all duration-500">
            {data?.total_providers} {t("providers")}
          </span>
          {/* View More with Animation */}
          <button className="text-base font-normal primary_text_color -mt-12 group-hover:-mt-[72px] transition-all duration-500 flex items-center justify-start gap-2">
            <span>{t("viewMore")}</span>
            <span className={` ${isRTL ? "rotate-180" : "rotate-0"}`}>
              <FaArrowRightLong size={16} />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeCategoryCard;
