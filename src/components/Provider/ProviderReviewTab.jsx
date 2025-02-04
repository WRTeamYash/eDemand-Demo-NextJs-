import React, { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import Rating from "./Rating";
import ProviderReviewCard from "./ProviderReviewCard";
import { getRatings } from "@/api/apiRoutes";
import MiniLoader from "../ReUseableComponents/MiniLoader";
import NoDataFound from "../ReUseableComponents/Error/NoDataFound";
import { useTranslation } from "../Layout/TranslationContext";
const ProviderReviewTab = ({ providerData }) => {
  const t = useTranslation();

  const rating = providerData?.ratings;
  const totalRating = providerData?.number_of_ratings;

  // Mock data for ratings and their counts
  const ratingData = [
    { rating: 5, count: providerData?.["5_star"] || 0 },
    { rating: 4, count: providerData?.["4_star"] || 0 },
    { rating: 3, count: providerData?.["3_star"] || 0 },
    { rating: 2, count: providerData?.["2_star"] || 0 },
    { rating: 1, count: providerData?.["1_star"] || 0 },
  ];

  const [loading, setLoading] = useState(false);
  const [isloadMore, setIsloadMore] = useState(false);
  const [reviewsData, setReviewsData] = useState([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const limit = 5;
  const [offset, setOffset] = useState(0);

  const fetchReviews = async (append = false, customOffset = offset) => {
    if (append) {
      setIsloadMore(true); // Set Load More button state to loading
    } else {
      setLoading(true); // Set initial fetch to loading
    }
    try {
      const response = await getRatings({
        partner_id: providerData?.partner_id,
        limit: limit,
        offset: customOffset,
      });
      if (response?.error === false) {
        setReviewsData((prevReviews) =>
          append ? [...prevReviews, ...response?.data] : response?.data
        );
        setTotalReviews(response?.total);
      } else {
        setReviewsData([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setIsloadMore(false);
    }
  };

  const handleLoadMore = async () => {
    // Compute the new offset value
    const newOffset = offset + limit;
    setOffset(newOffset); // Update the state for offset

    // Pass the computed offset directly to fetchAllProviders
    await fetchReviews(true, newOffset); // Ensure the correct offset is used
  };

  useEffect(() => {
    fetchReviews(false, 0);
  }, []);

  return reviewsData.length > 0 ? (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-12 border rounded-md px-4 py-6 gap-4">
        {/* Left column for rating summary */}
        <div className="col-span-12 md:col-span-3">
          <div className="flex flex-col items-center justify-center w-full h-full light_bg_color rounded-md px-4 py-6">
            <span className="text-[28px] font-medium primary_text_color">
              {rating}
            </span>
            <Rating rating={rating} />
            <span className="mt-2 text-base description_color">
              {totalRating} {t("ratings")}
            </span>
          </div>
        </div>

        {/* Right column for rating progress */}
        <div className="col-span-12 md:col-span-9">
          {ratingData.map((item) => {
            const progressPercentage = (item.count / totalRating) * 100;
            return (
              <div className="rating_progress mb-4" key={item.rating}>
                <div className="flex gap-4 items-center">
                  <span>{item.rating}</span>
                  <Progress
                    value={progressPercentage}
                    className="progress flex-1 h-2 mx-2 rounded-lg"
                    style={{ fill: "#4caf50" }}
                  />
                  <span className="">{item.count}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews mt-8">
        <span className="text-2xl font-semibold">{t("reviews")}</span>

        <div className="space-y-8 mt-6">
          {reviewsData.map((review) => (
            <ProviderReviewCard review={review} key={review.id} />
          ))}
        </div>

        {/* Load More Button */}
        <div className="flex items-center justify-center mt-6">
          {isloadMore ? (
            <button className="primary_bg_color primary_text_color py-3 px-8 rounded-xl">
              <MiniLoader />
            </button>
          ) : (
            reviewsData.length < totalReviews && (
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
  ) : (
    <div className="w-full h-[60vh] flex items-center justify-center">
      <NoDataFound title={t("noRatings")} desc={t("noRatingsText")} />
    </div>
  );
};

export default ProviderReviewTab;
