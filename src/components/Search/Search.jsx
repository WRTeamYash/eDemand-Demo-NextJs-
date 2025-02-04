"use client";
import React, { useState, useEffect, useRef } from "react";
import Layout from "../Layout/Layout";
import BreadCrumb from "../ReUseableComponents/BreadCrumb";
import { IoSearch } from "react-icons/io5";
import ProviderDetailsServiceCard from "../Provider/ProviderDetailsServiceCard";
import { useDispatch, useSelector } from "react-redux";
import NoDataFound from "../ReUseableComponents/Error/NoDataFound";
import { search_services_providers } from "@/api/apiRoutes";
import NearbyProviderCard from "../Cards/NearbyProviderCard";
import { useRouter } from "next/router";
import { convertToSlug, placeholderImage, useRTL } from "@/utils/Helper";
import CustomImageTag from "../ReUseableComponents/CustomImageTag";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { toast } from "react-toastify";
import { FaSearch } from "react-icons/fa";
import { useTranslation } from "../Layout/TranslationContext";
import { setActiveTab } from "@/redux/reducers/helperSlice";

const Search = () => {
  const t = useTranslation();
  const isRTL = useRTL();

  const router = useRouter();
  const slug = router?.query?.slug;
  const formattedSlug = slug ? slug.replace(/-/g, " ") : "";

  const type = router?.query?.type;
  const swiperRef = useRef(null);

  const breakpoints = {
    320: {
      slidesPerView: 1,
    },
    375: {
      slidesPerView: 1,
    },
    576: {
      slidesPerView: 1.1,
    },
    768: {
      slidesPerView: 1.3,
    },
    992: {
      slidesPerView: 1.5,
    },
    1200: {
      slidesPerView: 2,
    },
    1400: {
      slidesPerView: 2.1,
    },
  };
  const locationData = useSelector((state) => state?.location);
  const [searchQuery, setSearchQuery] = useState(formattedSlug);
  const [activeTabType, setActiveTabType] = useState(type ? type : "service");

  const [servicesData, setServicesData] = useState([]);
  const [providersData, setProvidersData] = useState([]);
  const [total, setTotal] = useState("");

  const fetchServicesAndProviders = async () => {
    try {
      const response = await search_services_providers({
        type: activeTabType,
        search: searchQuery ? searchQuery : "",
        latitude: locationData?.lat,
        longitude: locationData?.lng,
      });
      setTotal(response?.data?.total);
      setServicesData(response?.data?.Services);
      setProvidersData(response?.data?.providers);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchServicesAndProviders();
  }, [activeTabType, slug]);

  const handleViewAll = (slug, tab) => {
    router.push(`/provider-details/${slug}`);
    setActiveTab(tab);
  };

  const handleSearchServiceOrProvider = () => {
    if (!searchQuery.trim()) {
      // Show a toast error when search query is empty
      toast.error(t("pleaseTypeServiceOrProviderName"));
      return; // Exit the function
    }
    const slug = convertToSlug(searchQuery); // Convert the search query to a slug

    // Navigate to the search page
    router.push(`/search/${slug}?type=${activeTabType}`);
  };
  return (
    <Layout>
      <BreadCrumb firstEle={"Search"} firstEleLink="/search" />
      <section className="search">
        <div className="container mx-auto">
          {/* search query */}
          <div>
            <span className="text-2xl font-medium mb-2 block sm:block md:inline">
              {t("gettingResultFor")}{" "}
              <span className="primary_text_color capitalize">
                "{formattedSlug}"
              </span>
            </span>
            <p className="text-sm description_color mb-6">
              {total} {t("results")}
            </p>
          </div>
          {/* search filter */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mb-6">
            <div className="col-span-12 lg:col-span-4 xl:col-span-3">
              <div className="flex border p-3 rounded-xl w-full">
                <button
                  className={`w-full px-6 py-2 text-base transition-all duration-150 ${
                    activeTabType === "service"
                      ? "light_bg_color primary_text_color"
                      : ""
                  } rounded-lg`}
                  onClick={() => setActiveTabType("service")}
                >
                  {t("services")}
                </button>
                <button
                  className={`w-full px-6 py-2 text-base transition-all duration-150 ${
                    activeTabType === "provider"
                      ? "light_bg_color primary_text_color"
                      : ""
                  } rounded-lg`}
                  onClick={() => setActiveTabType("provider")}
                >
                  {t("providers")}
                </button>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-8 xl:col-span-9">
              <div className="relative flex items-center gap-2 border p-3 rounded-xl w-full">
                <div className="flex items-center gap-1 w-full py-2">
                  <IoSearch size={20} className="primary_text_color" />
                  <input
                    type="text"
                    placeholder="search here"
                    className="focus:outline-none bg-transparent w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button
                  onClick={handleSearchServiceOrProvider}
                  className="transition-all duration-150 rounded primary_bg_color px-2 md:px-6 py-2 text-white"
                >
                  {/* Display 'Search' on larger screens */}
                  <span className="hidden md:inline">{t("search")}</span>

                  {/* Display the search icon on smaller screens */}
                  <span className="inline md:hidden">
                    <FaSearch size={20} />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* search data */}
        <div className="light_bg_color px-6 py-10">
          <div className="container mx-auto">
            {activeTabType === "service" ? (
              <>
                <div className="grid grid-cols-1 gap-4">
                  {servicesData?.length > 0 ? (
                    servicesData?.map((service) => (
                      <>
                        <div className="card_bg rounded-xl w-full flex flex-col gap-3 py-3 px-4 md:p-6">
                          <div className="flex items-center justify-start gap-2">
                            <div className="w-12 h-12">
                              <CustomImageTag
                                src={service?.provider?.image}
                                alt={""}
                                placeholder={placeholderImage}
                                w={0}
                                h={0}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            </div>
                            <div className="provider_detail flex items-start justify-between w-full">
                              <div className="flex flex-col">
                                <span className="text-sm description_color">
                                  {service?.provider?.username}
                                </span>
                                <span className="text-lg font-semibold">
                                  {service?.provider?.company_name}
                                </span>
                              </div>
                              {service?.provider?.services.length > 2 && (
                                <div>
                                  <button
                                    className="p-2 primary_bg_color text-white rounded-lg"
                                    onClick={() =>
                                      handleViewAll(
                                        service?.provider?.id,
                                        "services"
                                      )
                                    }
                                  >
                                    {t("viewAll")}
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                          {service?.provider?.services?.length > 2 ? (
                            <div className="services_data flex justify-center">
                              <Swiper
                                spaceBetween={20}
                                slidesPerView={2}
                                breakpoints={breakpoints}
                                dir={isRTL ? "rtl" : "ltr"}
                                key={isRTL}
                                modules={[Autoplay]}
                                onSwiper={(swiper) => {
                                  swiperRef.current = swiper;
                                }}
                                className="custom-swiper"
                              >
                                {service?.provider?.services.map(
                                  (service, index) => (
                                    <SwiperSlide key={index}>
                                      <ProviderDetailsServiceCard
                                        data={service}
                                      />
                                    </SwiperSlide>
                                  )
                                )}
                              </Swiper>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                              {service?.provider?.services.map(
                                (service, index) => (
                                  <div key={index}>
                                    <ProviderDetailsServiceCard
                                      data={service}
                                    />
                                  </div>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      </>
                    ))
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <NoDataFound
                        title={t("noSearchResults")}
                        desc={t("noSearchResulltsText")}
                      />
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {providersData?.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {providersData?.map((provider, index) => (
                      <NearbyProviderCard provider={provider} key={index} />
                    ))}
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <NoDataFound
                      title={"We couldn't find it."}
                      desc={
                        "Try searching for something else or use different keywords."
                      }
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Search;
