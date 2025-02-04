import React from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { removeCategoryBySlug } from "@/redux/reducers/multiCategoriesSlice";
import { useTranslation } from "../Layout/TranslationContext";
import { useRTL } from "@/utils/Helper";

const CategoryBreadcrumb = ({ selectedCategories }) => {
  const t = useTranslation();
  const isRTL = useRTL();
  const dispatch = useDispatch();
  const router = useRouter();
  // Extract the last slug from the current path
  const pathSegments = router.asPath.split('/');
  const lastSlug = pathSegments[pathSegments.length - 1];

  const handleCategoryClick = (slug, event) => {
    // Prevent the default anchor link behavior
    event.preventDefault();

    // Dispatch the action to remove the clicked category by slug
    dispatch(removeCategoryBySlug(slug));

    // Redirect the user to the appropriate path after trimming
    const currentPath = router.asPath;
    const pathSegments = currentPath.split("/");
    const clickedCategoryIndex = pathSegments.findIndex(
      (segment) => segment === slug
    );

    if (clickedCategoryIndex !== -1) {
      const newPath = pathSegments.slice(0, clickedCategoryIndex + 1).join("/");
      router.push(`/${newPath}`);
    }
  };

  return (
    <div className="custom-breadcrumb py-4 my-6 light_bg_color">
      <div className="container mx-auto">
        <Breadcrumb className="flex items-center flex-wrap gap-2 [&_li]:list-none [&_ol]:list-none">
          {/* Home breadcrumb */}
          <BreadcrumbItem>
            <Link href="/" className="text-sm font-normal hover:primary_text_color" title={t("home")}>
              {t("home")}
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="separator w-6">
            <ChevronRight className={`${isRTL ? "rotate-180" : "rotate-0"}`} />
          </BreadcrumbSeparator>

          {/* Categories breadcrumb */}
          <BreadcrumbItem>
            <Link
              href="/categories"
              className="text-sm font-normal hover:primary_text_color"
              title={t("categories")}
            >
              {t("categories")}
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="separator w-6">
            <ChevronRight className={`${isRTL ? "rotate-180" : "rotate-0"}`} />
          </BreadcrumbSeparator>

          {/* Dynamically render category breadcrumbs */}
          {selectedCategories.map((category, index) => (
            <React.Fragment key={category?.id}>
              <BreadcrumbItem>
                <Link
                  href="#"
                  title={category?.name}
                  className={`text-sm font-normal hover:primary_text_color ${
                    category?.id === lastSlug ? "primary_text_color font-bold" : ""
                  }`}
                  onClick={(e) => handleCategoryClick(category.id, e)} // Pass event to the handler
                >
                  {category?.name}
                </Link>
              </BreadcrumbItem>
              {index < selectedCategories.length - 1 && (
                <BreadcrumbSeparator className="separator w-6">
                  <ChevronRight className={`${isRTL ? "rotate-180" : "rotate-0"}`} />
                </BreadcrumbSeparator>
              )}
            </React.Fragment>
          ))}
        </Breadcrumb>
      </div>
    </div>
  );
};

export default CategoryBreadcrumb;
