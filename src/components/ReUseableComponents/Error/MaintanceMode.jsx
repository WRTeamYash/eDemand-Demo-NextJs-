import React from "react";
import { maintanceModeImage } from "./Images";
import { useTranslation } from "@/components/Layout/TranslationContext";

const MaintenanceMode = () => {
    const  t  = useTranslation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center card_bg text-center p-4">
      {/* Main Content */}
      <div className="max-w-md space-y-6 flex flex-col items-center justify-center">
        {/* Illustration */}
        {maintanceModeImage}

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          {t("maintenanceModeTitle")}
        </h1>

        {/* Subtitle */}
        <p className="text-base md:text-xl text-gray-600 dark:text-white">
          {t("maintenanceModeText")}
        </p>

        {/* Call-to-Action Button */}
        {/* <a
          href="/"
          className="inline-block px-6 py-3 primary_text_color light_bg_color text-white font-semibold rounded-lg transition duration-300"
        >
          {t("goBackHomeHomePage")}
        </a> */}
      </div>
    </div>
  );
};

export default MaintenanceMode;