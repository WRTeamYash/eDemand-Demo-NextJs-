"use client"
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/router";
import Link from "next/link";
import { useTranslation } from "@/components/Layout/TranslationContext";
import { useDispatch, useSelector } from "react-redux";
import { selectBookingStatus, setBookingStatus } from "@/redux/reducers/helperSlice";

const BookingSecHeader = () => {
  const router = useRouter();
  const t = useTranslation();
  const bookingStatus = useSelector(selectBookingStatus);
  const [status, setStatus] = useState(bookingStatus);

  const dispatch = useDispatch(); 
  const handleStatusChange = (value) => {
    setStatus(value);
    dispatch(setBookingStatus(value));
  };

  return (
    <div className="filter flex flex-wrap items-center justify-between gap-4 p-4 light_bg_color rounded-xl">
      <div className="flex flex-wrap gap-3">
        <Link
          href="/general-bookings"
          title={t("generalBookings")}
          className={`card_bg p-3 rounded-lg transition-all duration-300 ${
            router.pathname === "/general-bookings"
              ? "primary_bg_color text-white"
              : ""
          }`}
        >
          {t("generalBookings")}
        </Link>
        <Link
          href="/requested-bookings"
          title={t("requestedBookings")}
          className={`card_bg p-3 rounded-lg transition-all duration-300 ${
            router.pathname === "/requested-bookings"
              ? "primary_bg_color text-white"
              : ""
          }`}
        >
           {t("requestedBookings")}
        </Link>
      </div>
      <div className="filter_dropdown flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full sm:w-auto">
        <span className="description_color text-sm sm:text-base">
          {t("status")}
        </span>
        <Select onValueChange={handleStatusChange} value={status}>
          <SelectTrigger className="w-full sm:w-[180px] px-4 py-2 rounded-md border-none focus:outline-none focus:ring-0 focus:ring-transparent">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("all")}</SelectItem>
            <SelectItem value="awaiting">{t("awaiting")}</SelectItem>
            <SelectItem value="confirmed">{t("confirmed")}</SelectItem>
            <SelectItem value="started">{t("started")}</SelectItem>
            <SelectItem value="cancelled">{t("cancelled")}</SelectItem>
            <SelectItem value="rescheduled">{t("rescheduled")}</SelectItem>
            <SelectItem value="booking_ended">{t("booking_ended")}</SelectItem>
            <SelectItem value="completed">{t("completed")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default BookingSecHeader;
