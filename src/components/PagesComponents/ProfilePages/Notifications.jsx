"use client";
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout/Layout";
import SideNavigation from "@/components/PagesComponents/ProfilePages/SideNavigation";
import BreadCrumb from "@/components/ReUseableComponents/BreadCrumb";
import NotificationCard from "@/components/Cards/NotificationCard";
import { userNotifications } from "@/api/apiRoutes";
import MiniLoader from "@/components/ReUseableComponents/MiniLoader";
import { useTranslation } from "@/components/Layout/TranslationContext";
import withAuth from "@/components/Layout/withAuth";

const Notifications = () => {
  const t = useTranslation();


  const [notifications, setNotifications] = useState([]);
  const [total, setTotal] = useState(0);
  const limit = 10; // Number of providers per fetch
  const [offset, setOffset] = useState(0); // Offset for pagination
  const [loading, setLoading] = useState(false); // To manage button loading state
  const [isloadMore, setIsloadMore] = useState(false);

  const fetchNotifications = async (append = false, customOffset = offset) => {
    if (append) {
      setIsloadMore(true); // Set Load More button state to loading
    } else {
      setLoading(true); // Set initial fetch to loading
    }
    try {
      const response = await userNotifications({
        limit: limit,
        offset: customOffset,
      });
      if (response?.error === false) {
        setNotifications((prevNofications) =>
          append ? [...prevNofications, ...response?.data] : response?.data
        );
        setTotal(response?.total);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsloadMore(false);
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    // Compute the new offset value
    const newOffset = offset + limit;
    setOffset(newOffset); // Update the state for offset

    // Pass the computed offset directly to fetchAllProviders
    await fetchNotifications(true, newOffset); // Ensure the correct offset is used
  };
  useEffect(() => {
    fetchNotifications(false, 0);
  }, []);

  return (
    <Layout>
      <BreadCrumb firstEle={t("notifications")} firstEleLink="/notifications" />
      <section className="profile_sec my-12">
        <div className="container mx-auto">
          {/* Grid layout */}
          <div className="grid grid-cols-12 gap-6">
            {/* Sidebar */}
            <div className="col-span-12 lg:col-span-3">
              <SideNavigation />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-9 col-span-12">
              <div className="flex flex-col gap-6">
                <div className="page-headline text-2xl sm:text-3xl font-semibold">
                  <span>{t("notifications")}</span>
                </div>
                <div className="flex flex-col gap-6">
                  {notifications.map((notification, index) => (
                    <NotificationCard key={index} data={notification} />
                  ))}
                </div>

                {/* Load More Button */}
                <div className="loadmore my-6 flex items-center justify-center">
                  {isloadMore ? (
                    <button className="primary_bg_color primary_text_color py-3 px-8 rounded-xl">
                      <MiniLoader />
                    </button>
                  ) : (
                    notifications?.length < total && (
                      <button
                        onClick={handleLoadMore}
                        className="light_bg_color primary_text_color py-3 px-8 rounded-xl"
                        disabled={isloadMore}
                      >
                        {t("loadMore")}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default withAuth(Notifications);