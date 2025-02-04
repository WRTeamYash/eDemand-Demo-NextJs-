"use client";
import React from "react";
import { useRouter } from "next/router";
import { CheckCircle, XCircle } from "lucide-react"; // Icons for success and failure
import Lottie from "lottie-react"; // For animations
import successAnimation from "../../../../public/animations/success.json"; // Success animation
import { useTranslation } from "@/components/Layout/TranslationContext";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, clearChekoutData } from "@/redux/reducers/cartSlice";
import { clearReorder } from "@/redux/reducers/reorderSlice";

const PaymentStatus = () => {
  const t = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();
  const { status, payment_status, order_id } = router.query; // Get status and order_id from query params
  const isReorderMode = useSelector(state => state.reorder.isReOrder);

  const isSuccess = status === "successful" || payment_status === 'Completed'; // Check if payment was successful

  // Handle navigation to home
  const handleGoHome = () => {
    router.push("/");
    dispatch(clearChekoutData());
    if (isReorderMode) {
      dispatch(clearReorder());
    } else {
      dispatch(clearCart());
    }
  };

  // Handle navigation to order details
  const handleGoToOrderDetails = () => {
    if (order_id) {
      dispatch(clearChekoutData());
      if (isReorderMode) {
        dispatch(clearReorder());
      } else {
        dispatch(clearCart());
      }
      router.push(`/booking/${order_id}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen light_bg_color">
      <div className="card_bg p-8 rounded-lg shadow-lg text-center max-w-md w-full">
        {/* Animation */}
        {isSuccess && (
          <div className="flex justify-center mb-6">
            <Lottie
              animationData={successAnimation}
              loop={false}
              style={{ width: 250, height: 250 }}
            />
          </div>
        )}

        {/* Status Icon and Message */}
        <div className="flex justify-center mb-6">
          {!isSuccess && <XCircle className="w-16 h-16 text-red-500" />}
        </div>

        {/* Status Text */}
        <h1 className="text-2xl font-bold mb-4">
          {isSuccess ? t("paymentSuccess") : t("paymentFailed")}
        </h1>
        <p className="description_color mb-8">
          {isSuccess ? t("paymentSuccessText") : t("paymentFailedText")}
        </p>

        {/* Buttons */}
        <div className="flex flex-col space-y-4">
          {/* {isSuccess && ( */}
            <button
              onClick={handleGoToOrderDetails}
              className="w-full primary_bg_color p-3 rounded-lg text-white"
            >
              {t("viewOrderDetails")}
            </button>
          {/* )} */}
          <button
            onClick={handleGoHome}
            className="w-full light_bg_color p-3 rounded-lg primary_text_color"
          >
            {t("goHome")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatus;
