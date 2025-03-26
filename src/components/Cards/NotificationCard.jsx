"use client";
import React from "react";
import CustomImageTag from "../ReUseableComponents/CustomImageTag";

const NotificationCard = ({ data }) => {
  return (
    <div className="flex items-center justify-between border-b  last:border-b-0 pb-4 gap-4">
      {/* Image */}
      <div className="w-16 h-16 rounded overflow-hidden">
        <CustomImageTag
          src={data?.image}
          alt={data?.title}
          className="w-full h-full object-cover"
          width={0}
          height={0}
          loading="lazy"
        />
      </div>
      {/* Notification Content */}
      <div className="flex-1">
        <h3 className="font-semibold text-lg">{data?.title}</h3>
        <p className="text-sm description_color">{data?.message}</p>
      </div>
      {/* Time */}
      <div className="description_color text-sm whitespace-nowrap">
        {data?.duration}
      </div>
    </div>
  );
};

export default NotificationCard;
