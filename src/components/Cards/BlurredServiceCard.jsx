"use client";
import React from "react";
import { ArrowRight } from "lucide-react";
import { placeholderImage, useRTL } from "@/utils/Helper";
import CustomImageTag from "../ReUseableComponents/CustomImageTag";
import { useTranslation } from "../Layout/TranslationContext";

const BlurredServiceCard = ({ elem, handleRouteChange }) => {
  const t = useTranslation();
  const isRTL = useRTL();
  return (
    <div
      className="relative w-full h-[345px] rounded-2xl overflow-hidden cursor-pointer group"
      onClick={() => handleRouteChange(elem)}
    >
      <CustomImageTag
        width={0}
        height={0}
        className="w-full h-full absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
        src={elem?.image}
        alt={`${elem?.name}`}
        onError={placeholderImage}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <h3 className="text-lg font-semibold mb-1">{elem?.name}</h3>
        <div className="flex items-center justify-between">
          <span className="text-sm">
            {elem?.total_providers} {t("providers")}
          </span>
          <ArrowRight
            className={`opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
              isRTL ? "rotate-180" : "rotate-0"
            }`}
            size={20}
          />
        </div>
      </div>
    </div>
  );
};

export default BlurredServiceCard;
