"use client";
import { getProviders, getSubCategory } from "@/api/apiRoutes";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "swiper/css";
import { Autoplay, FreeMode, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { addCategory } from "../../redux/reducers/multiCategoriesSlice";
import BlurredServiceCard from "../Cards/BlurredServiceCard";
import NearbyProviderCard from "../Cards/NearbyProviderCard";
import Layout from "../Layout/Layout";
import CategoryBreadcrumb from "../ReUseableComponents/CategoryBreadcrumb";
import BlurredServiceCardSkeleton from "../Skeletons/BlurredServiceCardSkeleton";
import NearbyProviderCardSkeleton from "../Skeletons/NearbyProviderCardSkeleton";
import NoDataFound from "../ReUseableComponents/Error/NoDataFound";
import { useTranslation } from "../Layout/TranslationContext";
import { useRTL } from "@/utils/Helper";

const CategoryDetails = () => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const t = useTranslation();
  const isRTL = useRTL();

  // Get slug dynamically
  const slug = router.query.slug;
  const lastSlug = Array.isArray(slug) ? slug[slug.length - 1] : slug;

  // Access selected category from Redux store
  const selectedCategories = useSelector(
    (state) => state.multiCategories.selectedCategories
  );
  const locationData = useSelector((state) => state?.location);
  const [loading, setLoading] = useState(false);
  const [subCategories, setSubCategories] = useState([]);
  const [subCatTotal, setSubCatTotal] = useState(0);
  const [providerstTotal, setProvidersTotal] = useState(0);
  const [providers, setProviders] = useState([]);
  const limit = 6;

  const breakpoints = {
    320: {
      slidesPerView: 1,
    },
    375: {
      slidesPerView: 1.5,
    },
    576: {
      slidesPerView: 2,
    },
    768: {
      slidesPerView: 2.5,
    },
    992: {
      slidesPerView: 3,
    },
    1200: {
      slidesPerView: 3.5,
    },
    1400: {
      slidesPerView: 4,
    },
    1600: {
      slidesPerView: 4.5,
    },
  };

  const fetchSubCategory = async () => {
    setLoading(true);
    try {
      const response = await getSubCategory({
        latitude: locationData?.lat,
        longitude: locationData?.lng,
        category_id: lastSlug,
      });
      if (response?.error === false) {
        setSubCategories(response?.data);
        setLoading(false);
        setSubCatTotal(response?.total);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const response = await getProviders({
        latitude: locationData?.lat,
        longitude: locationData?.lng,
        category_id: lastSlug,
      });
      if (response?.error === false) {
        setProviders(response?.data);
        setLoading(false);
        setProvidersTotal(response?.total);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (lastSlug) {
      fetchSubCategory();
      fetchProviders();
    }
  }, [lastSlug]);

  const handleRouteCategory = (category) => {
    // Check if the category is already in selectedCategories
    const isCategorySelected = selectedCategories.some(
      (cat) => cat?.id === category?.id
    );

    // If the category is not already selected, dispatch the action and route to it
    if (!isCategorySelected) {
      // Dispatch the category details to Redux
      dispatch(addCategory(category));

      // Navigate to the category details page
      router.push(`${pathname}/${category?.id}`);
    }
  };
  return (
    <Layout>
      <CategoryBreadcrumb selectedCategories={selectedCategories} />
      <section className="category-details">
        <div className="container mx-auto">
          <div className="sub-cateSec">
            {loading || (subCategories && subCategories.length > 0) ? (
              <>
                <div className="commanSec mt-12 flex flex-col items-start justify-center gap-6 w-full">
                  <div className="Headlines flex flex-col w-full">
                    <span className="text-2xl font-semibold">
                      {t("categoriesIn")} {lastSlug}
                    </span>
                    <span className="description_color">
                      {subCatTotal} {t("subCategories")}
                    </span>
                  </div>
                </div>
                <div className="sub-cate-swiper my-6">
                  <Swiper
                  key={isRTL}
                    modules={[Autoplay, FreeMode, Navigation]} // Include FreeMode module
                    spaceBetween={30}
                    loop={false}
                    autoplay={{ delay: 3000 }} // Autoplay functionality
                    freeMode={true} // Enable free mode
                    breakpoints={breakpoints} // Add breakpoints here
                    dir={isRTL ? "rtl" : "ltr"}
                    className="mySwiper"
                  >
                    {loading
                      ? // Render skeleton cards if loading
                        Array.from({ length: 5 }).map((_, index) => (
                          <SwiperSlide key={`skeleton-${index}`}>
                            <BlurredServiceCardSkeleton />
                          </SwiperSlide>
                        ))
                      : // Render actual cards if not loading
                        subCategories?.map((service) => (
                          <SwiperSlide key={service.id}>
                            <BlurredServiceCard
                              elem={service}
                              handleRouteChange={handleRouteCategory}
                            />
                          </SwiperSlide>
                        ))}
                  </Swiper>
                </div>
              </>
            ) : null}
          </div>
        </div>
        <div className="providerSec">
          {loading || (providers && providers.length > 0) ? (
            <>
              <div className="commanSec mt-12 flex flex-col items-start justify-center gap-6 w-full container mx-auto">
                <div className="Headlines flex flex-col w-full">
                  <span className="text-2xl font-semibold">
                    {" "}
                    {t("providersIn")} {lastSlug}
                  </span>
                  <span className="description_color">
                    {providerstTotal} {t("providers")}
                  </span>
                </div>
              </div>
              <div className="commanDataSec light_bg_color p-4 w-full mt-6">
                <div className="container mx-auto py-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {loading
                      ? // Render skeleton cards if loading
                        Array.from({ length: 6 }).map((_, index) => (
                          <SwiperSlide key={`skeleton-${index}`}>
                            <NearbyProviderCardSkeleton />
                          </SwiperSlide>
                        ))
                      : providers.map((provider, index) => (
                          <div key={index}>
                            <NearbyProviderCard provider={provider} />
                          </div>
                        ))}
                  </div>
                </div>
              </div>
              {providers.length > 6 && (
                <div className="loadmore my-6 flex items-center justify-center">
                  <button className="light_bg_color primary_text_color py-3 px-8 rounded-xl">
                   {t("loadMore")}{" "}
                  </button>
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* No Data Found */}
        {!loading && !subCategories?.length && !providers?.length && (
          <div className="no-data-found my-12 flex flex-col items-center justify-center">
           <NoDataFound title={"No Data Found"} desc={"Unfortunately, we couldn't find any providers or categories."}/>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default CategoryDetails;
