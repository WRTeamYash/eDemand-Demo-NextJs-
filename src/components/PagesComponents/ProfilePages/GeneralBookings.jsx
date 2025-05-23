"use client";
import Layout from "@/components/Layout/Layout";
import BreadCrumb from "@/components/ReUseableComponents/BreadCrumb";
import React, { useState, useEffect } from "react";
import SideNavigation from "./SideNavigation";
import BookingSecHeader from "./BookingSecHeader";
import GeneralBookingCard from "@/components/Cards/GeneralBookingCard";
import { getOrdersApi } from "@/api/apiRoutes";
import MiniLoader from "@/components/ReUseableComponents/MiniLoader";
import GeneralBookingCardSkeleton from "@/components/Skeletons/GeneralBookingCardSkeleton";
import NoDataFound from "@/components/ReUseableComponents/Error/NoDataFound";
import { useTranslation } from "@/components/Layout/TranslationContext";
import { selectBookingStatus } from "@/redux/reducers/helperSlice";
import { useSelector } from "react-redux";
import withAuth from "@/components/Layout/withAuth";
import { isMobile } from "@/utils/Helper";

const GeneralBookings = () => {
  const t = useTranslation();
  const bookingStatus = useSelector(selectBookingStatus);
  const [bookigs, setBookigs] = useState([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0); // Offset for pagination
  const limit = 8; // Number of providers per fetch
  const [loading, setLoading] = useState(false); // To manage button loading state
  const [isloadMore, setIsloadMore] = useState(false);

  const fetchBookings = async (append = false, customOffset = offset) => {
    if (append) {
      setIsloadMore(true); // Set Load More button state to loading
    } else {
      setLoading(true); // Set initial fetch to loading
    }
    try {
      const response = await getOrdersApi({
        status: bookingStatus === "all" ? "" : bookingStatus,
        offset: customOffset,
        limit: limit,
      });
      if (response?.error === false) {
        setBookigs((prevBookings) =>
          append ? [...prevBookings, ...response?.data] : response?.data
        );
        setTotal(response?.total);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Stop initial loading state
      setIsloadMore(false); // Stop Load More button loading state
    }
  };

  const handleLoadMore = async () => {
    // Compute the new offset value
    const newOffset = offset + limit;
    setOffset(newOffset); // Update the state for offset

    // Pass the computed offset directly to fetchAllProviders
    await fetchBookings(true, newOffset); // Ensure the correct offset is used
  };

  useEffect(() => {
    fetchBookings(false, 0);
  }, [bookingStatus]);

  return (
    <Layout>
      <BreadCrumb
        firstEle={t("generalBookings")}
        firstEleLink="/general-bookings"
        isMobile={isMobile}
      />
      <section className="profile_sec md:my-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Grid layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-3 hidden md:block">
              <SideNavigation />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-9">
              <div className="flex flex-col gap-6">
                <div className="page-headline text-xl md:text-2xl sm:text-3xl font-semibold border-b pb-3 md:pb-0 md:border-none">
                  <span>{t("bookings")}</span>
                </div>
                <div>
                  <BookingSecHeader />
                </div>
                <>
                  {/* Grid Section */}
                  {loading ? (
                    // Skeleton when loading
                    <div className="grid grid-cols-1 sm:grid-cols-1 xl:grid-cols-2 gap-6">
                      {[...Array(8)].map((_, index) => (
                        <GeneralBookingCardSkeleton key={index} />
                      ))}
                    </div>
                  ) : bookigs?.length === 0 ? (
                    // No Data Found Message
                    <div className="w-full h-[60vh] flex items-center justify-center">
                      <NoDataFound
                        title={t("noBookings")}
                        desc={t("noBookingText")}
                      />
                    </div>
                  ) : (
                    // Render Booking Cards
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-1 xl:grid-cols-2 gap-6">
                        {bookigs?.map((booking, index) => (
                          <GeneralBookingCard data={booking} key={index} />
                        ))}
                      </div>

                      {/* Load More Button */}
                      <div className="loadmore my-6 flex items-center justify-center">
                        {isloadMore ? (
                          <button className="primary_bg_color primary_text_color py-3 px-8 rounded-xl">
                            <MiniLoader />
                          </button>
                        ) : (
                          bookigs.length < total && (
                            <button
                              onClick={handleLoadMore}
                              className="primary_bg_color text-white py-3 px-8 rounded-xl"
                              disabled={isloadMore}
                            >
                             {t("loadMore")}
                            </button>
                          )
                        )}
                      </div>
                    </>
                  )}
                </>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default withAuth(GeneralBookings);
