"use client";
import React from "react";
import CustomImageTag from "./CustomImageTag";
import { useRouter } from "next/router";

const Banner = ({ banner }) => {
  const router = useRouter();
  const bannerData = banner?.banner[0];

  const handleRouteBanner = (e, banner) => {
    e.preventDefault();

    switch (banner?.type) {
      case "banner_url":
        if (banner?.banner_url) {
          // If the banner type is "url", open the specified URL in a new tab
          window.open(banner?.banner_url, "_blank");
        } else {
          console.warn("Missing banner_url:", banner);
        }
        break;

      case "banner_provider":
        // For "provider", open the provider route in a new tab
        const providerRoute = `/provider-details/${banner?.provider_slug}`;
        router.push(providerRoute);
        break;

      case "banner_category":
        const cateID =
          banner?.category_parent_id === "0"
            ? banner?.category_slug
            : banner?.parent_category_slug;
        // For "category", open the category route in a new tab
        const categoryRoute = `/services/${cateID}`;
        router.push(categoryRoute);
        break;

      default:
        console.warn("Invalid banner type or missing data:", banner);
        break;
    }
  };

  return (
    <div
      className="h-[130px] md:h-[400px] w-full cursor-pointer bg-transparent"
      onClick={(e) => handleRouteBanner(e, bannerData)}
    >
      <CustomImageTag
        src={bannerData?.web_banner_image}
        alt="banner"
        className="object-cover md:object-contain w-full h-full bg-transparent"
      />
    </div>
  );
};

export default Banner;
