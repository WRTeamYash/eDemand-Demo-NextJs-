import React from "react";
import { useRouter } from "next/router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "../Layout/TranslationContext";
import { useRTL } from "@/utils/Helper";

const BreadCrumb = ({
  firstEle,
  secEle,
  thirdEle,
  firstEleLink,
  SecEleLink,
  thirdEleLink,
}) => {
  const t = useTranslation();
  const isRTL = useRTL();
  const router = useRouter(); // Get the current route

  // Helper function to check if the link matches the current route
  const isActive = (link) => router.asPath === link;

  return (
    <div className="custom-breadcrumb py-4 my-6 light_bg_color">
      <div className="container mx-auto">
        <Breadcrumb className="flex flex-wrap items-center gap-1 sm:gap-2 [&_li]:list-none [&_ol]:list-none">
          {/* Home Breadcrumb */}
          <BreadcrumbItem>
            <Link
              href="/"
              className={`text-sm md:text-base font-normal ${isActive("/") ? "primary_text_color" : "hover:primary_text_color"
                }`}
              title={t("home")}
            >
              {t("home")}
            </Link>
          </BreadcrumbItem>

          {/* First Element */}
          {firstEle && (
            <>
              <BreadcrumbSeparator className="separator w-6">
                <ChevronRight className={`${isRTL ? "rotate-180" : "rotate-0"}`} />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                {firstEleLink ? (
                  <Link
                    href={firstEleLink}
                    className={`text-sm md:text-base font-normal ${isActive(firstEleLink)
                        ? "primary_text_color"
                        : "hover:primary_text_color"
                      }`}
                    title={firstEle}
                  >
                    {firstEle}
                  </Link>
                ) : (
                  <span className="text-sm md:text-base font-normal description_color">
                    {firstEle}
                  </span>
                )}
              </BreadcrumbItem>
            </>
          )}

          {/* Second Element */}
          {secEle && (
            <>
              <BreadcrumbSeparator className="separator w-6">
                <ChevronRight className={`${isRTL ? "rotate-180" : "rotate-0"}`} />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                {SecEleLink ? (
                  <Link
                    href={SecEleLink}
                    className={`text-sm text-nowrap md:text-base font-normal ${isActive(SecEleLink)
                        ? "primary_text_color"
                        : "hover:primary_text_color"
                      }`}
                    title={secEle}
                  >
                    {secEle}
                  </Link>
                ) : (
                  <span className="text-sm md:text-base font-normal description_color">
                    {secEle}
                  </span>
                )}
              </BreadcrumbItem>
            </>
          )}

          {/* Third Element */}
          {thirdEle && (
            <>
              <BreadcrumbSeparator className="separator w-6">
                <ChevronRight className={`${isRTL ? "rotate-180" : "rotate-0"}`} />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                {thirdEleLink ? (
                  <Link
                    href={thirdEleLink}
                    className={`text-sm text-nowrap md:text-base font-normal ${isActive(thirdEleLink)
                        ? "primary_text_color"
                        : "hover:primary_text_color"
                      }`}
                    title={thirdEle}
                  >
                    {thirdEle}
                  </Link>
                ) : (
                  <span className="text-sm md:text-base font-normal description_color">
                    {thirdEle}
                  </span>
                )}
              </BreadcrumbItem>
            </>
          )}
        </Breadcrumb>
      </div>
    </div>
  );
};

export default BreadCrumb;
