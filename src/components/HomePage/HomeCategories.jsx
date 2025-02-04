import React from "react";
import CommanHeadline from "../ReUseableComponents/CommanHeadline";
import HomeCategoryCard from "../Cards/HomeCategoryCard";
import { useDispatch } from "react-redux";
import {
  addCategory,
  clearCategories,
} from "../../redux/reducers/multiCategoriesSlice";
import { useRouter } from "next/router";
import { useTranslation } from "../Layout/TranslationContext";
import { useRTL } from "@/utils/Helper";

const HomeCategories = ({ categoriesData }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const t = useTranslation();
  const isRTL = useRTL();

  const handleRouteCategory = (category) => {
    dispatch(clearCategories());
    dispatch(addCategory(category));
    router.push(`/categories/${category?.id}`);
  };

  return (
    <div className="categories light_bg_color py-8">
      <div className="container mx-auto px-4 md:px-8">
        <CommanHeadline
          headline={t("chooseYourCategory")}
          subHeadline={t("discoverServices")}
          link={"/categories"}
        />

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categoriesData.slice(0, 8).map((category, index) => (
            <div key={index}>
              <HomeCategoryCard
                data={category}
                handleRouteCategory={handleRouteCategory}
                isRTL={isRTL}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeCategories;
