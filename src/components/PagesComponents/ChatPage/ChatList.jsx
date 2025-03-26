import { useTranslation } from "@/components/Layout/TranslationContext";
import CustomImageTag from "@/components/ReUseableComponents/CustomImageTag";
import { useRTL } from "@/utils/Helper";
import React from "react";
import { MdOutlineSupportAgent } from "react-icons/md";

const ChatList = ({
  handleAdminChat,
  isAdmin,
  chatListRef,
  handleChatListScroll,
  chatList,
  selectedChatTab,
  isLoadingMore,
  handleChangeTab,
}) => {
  const t = useTranslation();
  const isRTL = useRTL();

  return (
    <div
      className={`w-full md:w-1/4 card_bg rounded-l-lg overflow-hidden chatListWrapper min-w-[270px] ${
        isRTL ? "border-l" : "md:border-r"
      }`}
    >
      {/* Sticky Chat List Header */}
      <div className="flex items-center justify-between border-b p-2 sm:p-3 card_bg rounded-tr- sticky top-0 z-10">
        <h1 className="text-lg sm:text-xl">{t("chatList")}</h1>
        <span
          className={`p-1.5 cursor-pointer ${
            isAdmin ? "text-white primary_bg_color" : ""
          } rounded-full`}
          onClick={() => handleAdminChat()}
        >
          <MdOutlineSupportAgent className="text-xl sm:text-2xl" />
        </span>
      </div>

      {/* Scrollable Chat List */}
      <div
        className="h-[calc(100vh-180px)] sm:h-[650px] overflow-auto"
        ref={chatListRef}
        onScroll={handleChatListScroll}
      >
        {chatList?.map((list) => (
          <div
            key={list?.partner_id}
            className={`group w-full flex items-center gap-2 p-2 sm:p-3 lg:p-4 border-b relative 
                            before:content-[""] before:absolute before:w-[4px] before:primary_bg_color 
                            before:rounded-sm hover:light_bg_color ${
                              isRTL ? "before:right-0" : "before:left-0"
                            } cursor-pointer provider 
                            ${
                              selectedChatTab &&
                              ((selectedChatTab?.booking_id &&
                                selectedChatTab?.booking_id ===
                                  list?.booking_id) ||
                                (!selectedChatTab?.booking_id &&
                                  !list?.booking_id &&
                                  selectedChatTab?.partner_id ===
                                    list?.partner_id))
                                ? "before:h-full light_bg_color"
                                : ""
                            }`}
            onClick={(e) => handleChangeTab(e, list)}
          >
            <CustomImageTag
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover"
              src={list?.image}
              alt={list?.partner_name}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm sm:text-base truncate">
                {list?.partner_name}
              </p>
              {list?.booking_id !== null ? (
                <div className="flex flex-col text-xs sm:text-sm">
                  <div className="booking_id flex gap-1 items-center">
                    <span className="description_color">{t("bookingId")}:</span>
                    <span className="truncate">{list?.booking_id}</span>
                  </div>
                  <div className="booking_status flex gap-1 items-center">
                    <span className="description_color">
                      {t("bookingStatus")}:
                    </span>
                    <span className="truncate">{t(list?.order_status)}</span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-xs sm:text-sm truncate">
                  {t("preBookingEnq")}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Loading More Chats */}
      {isLoadingMore && (
        <div className="description_color p-1 text-center text-sm">
          {t("loadingMoreChats")}
        </div>
      )}
    </div>
  );
};

export default ChatList;
