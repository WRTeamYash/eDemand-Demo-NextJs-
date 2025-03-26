"use client";
import { deleteUserAccountApi } from "@/api/apiRoutes.js";
import { useTranslation } from "@/components/Layout/TranslationContext.jsx";
import DeleteAccountDiallog from "@/components/ReUseableComponents/Dialogs/DeleteAccountDiallog.jsx";
import LogoutDialog from "@/components/ReUseableComponents/Dialogs/LogoutDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { clearCart } from "@/redux/reducers/cartSlice.js";
import { clearChatData } from "@/redux/reducers/helperSlice.js";
import { clearUserData, getUserData } from "@/redux/reducers/userDataSlice.js";
import FirebaseData from "@/utils/Firebase.js";
import { isDemoMode, placeholderImage, useRTL } from "@/utils/Helper";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { BsBookmarkCheck, BsTools } from "react-icons/bs";
import { FaRegCalendarCheck } from "react-icons/fa";
import { IoMdNotificationsOutline } from "react-icons/io";
import {
  IoChatbubbleEllipsesOutline,
  IoLocationOutline,
} from "react-icons/io5";
import { LiaPowerOffSolid, LiaUserTimesSolid } from "react-icons/lia";
import { MdOutlineKeyboardArrowRight, MdOutlinePayments } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import EditProfileModal from "../../auth/EditProfile.jsx";

const SideNavigation = () => {
  const t = useTranslation();
  const isRTL = useRTL();
  const isDemo = isDemoMode();
  const router = useRouter();
  const dispatch = useDispatch();
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [openDeleteAccDialog, setOpenDeleteAccDialog] = useState(false);
  const userData = useSelector(getUserData);

  const { authentication, signOut } = FirebaseData();

  // Navigation items with categories
  const navItems = [
    {
      title: t("myBookings"),
      icon: <FaRegCalendarCheck size={18} />,
      route: ["/general-bookings", "/requested-bookings"],
      category: "",
    },
    {
      title: t("bookmarks"),
      icon: <BsBookmarkCheck size={18} />,
      route: ["/bookmarks"],
      category: "",
    },
    {
      title: t("myServiceRequests"),
      icon: <BsTools size={18} />,
      route: ["/my-services-requests"],
      category: "",
    },
    {
      title: t("notifications"),
      icon: <IoMdNotificationsOutline size={18} />,
      route: ["/notifications"],
      category: t("general"),
    },
    {
      title: t("myAddresses"),
      icon: <IoLocationOutline size={18} />,
      route: ["/addresses"],
      category: t("general"),
    },
    {
      title: t("paymentHistory"),
      icon: <MdOutlinePayments size={18} />,
      route: ["/payment-history"],
      category: t("accountAndPayment"),
    },
  ];

  // Additional items
  const additionalItems = [
    {
      title: t("logout"),
      icon: <LiaPowerOffSolid size={18} />,
      action: (e) => {
        e.preventDefault();
        setOpenLogoutDialog(true);
      },
    },
    {
      title: t("deleteAccount"),
      icon: <LiaUserTimesSolid size={18} />,
      action: (e) => {
        e.preventDefault();
        setOpenDeleteAccDialog(true);
      },
    },
  ];

  // Helper function to check if a route is active
  const isActive = (routes) => routes.includes(router.pathname);

  // Group items by category
  const groupedNavItems = navItems.reduce((groups, item) => {
    groups[item.category] = [...(groups[item.category] || []), item];
    return groups;
  }, {});

  const handleLogout = (e) => {
    if (e) e.preventDefault();
    setOpenLogoutDialog(false);
    dispatch(clearUserData());
    dispatch(clearCart());
    signOut();
    router.push("/");
  };

  const GoChats = () => {
    dispatch(clearChatData());
    router.push("/chats");
  };

  const handleDeleteAccount = async () => {
    if (isDemo) {
      toast.error(t("demoModeText"));
      setOpenDeleteAccDialog(false);
      return false;
    }

    try {
      const firebaseUser = authentication.currentUser;

      if (firebaseUser) {
        await firebaseUser
          .delete()
          .then(async () => {
            const response = await deleteUserAccountApi();
            if (response?.error === false) {
              toast.success(t("accountDeletedText"));
              setOpenDeleteAccDialog(false);
              handleLogout();
              router.push("/");
            }
          })
          .catch(async (error) => {
            if (
              error.code === "auth/requires-recent-login" ||
              error.code === "CREDENTIAL_TOO_OLD_LOGIN_AGAIN"
            ) {
              // Prompt user to log in again
              toast.error(t("reauthenticationRequired"));
              // Optional: Redirect the user to home
              handleLogout();
            } else {
              // For other errors, show a generic message
              toast.error(error.message || t("somethingWentWrong"));
            }
            console.log("error", error);
          });
      }
    } catch (error) {
      console.log("error", error);
      toast.error(error.message || t("somethingWentWrong"));
    }
  };

  return (
    <aside className="w-full sticky top-32">
      <div className="text-center mb-6 border custom-gradient dark:card_bg p-4 rounded-xl">
        <Avatar className="w-20 h-20 mx-auto rounded-full">
          <AvatarImage
            src={userData?.image ? userData?.image : placeholderImage}
            alt={userData?.username}
          />
          <AvatarFallback>
            {" "}
            {userData?.username
              ?.split(" ")
              .map((word) => word[0]?.toUpperCase())
              .slice(0, 2)
              .join("") || "NA"}
          </AvatarFallback>
        </Avatar>
        {userData?.username && (
          <h3 className="mt-4 font-bold text-lg">{userData?.username}</h3>
        )}
        {userData?.email && (
          <p className="description_color text-sm break-words">{userData?.email}</p>
        )}
        {userData?.phone && (
          <p className="description_color text-sm">{userData?.phone}</p>
        )}
        <button
          className="underline font-medium mt-3"
          onClick={() => setOpenProfileModal(true)}
        >
          {t("editProfile")}
        </button>
      </div>
      <ul className="space-y-6">
        <li>
          <button
            className="w-full flex items-center justify-center gap-4 p-3 text-sm font-normal rounded-[8px] light_bg_color primary_text_color"
            onClick={GoChats}
          >
            <IoChatbubbleEllipsesOutline size={22} />
            <span>{t("ChatWithProviders")}</span>
          </button>
        </li>
        {/* Render categories */}
        {Object.entries(groupedNavItems).map(([category, items], index) => (
          <div key={index} className="space-y-6">
            <span className="description_color text-base font-normal">
              {category}
            </span>
            {items.map((item, idx) => (
              <li key={idx} className="group">
                <Link
                  title={item.title}
                  href={item.route[0]}
                  className={`flex items-center justify-between gap-4 w-full p-3 rounded-[8px] border transition-all duration-300 group-hover:border_color ${
                    isActive(item.route)
                      ? "primary_bg_color text-white"
                      : "group-hover:primary_text_color custom-shadow"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`p-2 rounded-md transition-all duration-300 ${
                        isActive(item.route)
                          ? "card_bg primary_text_color"
                          : "background_color"
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span className="text-base font-medium">{item.title}</span>
                  </div>
                  <div className={`${isRTL ? "rotate-180" : ""}`}>
                    <MdOutlineKeyboardArrowRight size={24} />
                  </div>
                </Link>
              </li>
            ))}
          </div>
        ))}
        {additionalItems.map((item, idx) => (
          <li key={idx} className="group">
            <button
              className="flex items-center justify-between gap-4 w-full p-3 rounded-[8px] border transition-all duration-300 group-hover:border_color group-hover:primary_text_color custom-shadow"
              onClick={item.action}
            >
              <div className="flex items-center gap-4">
                <span className="p-2 background_color rounded-md">
                  {item.icon}
                </span>
                <span className="text-base font-medium">{item.title}</span>
              </div>
              <div className={`${isRTL ? "rotate-180" : ""}`}>
                <MdOutlineKeyboardArrowRight size={24} />
              </div>
            </button>
          </li>
        ))}
      </ul>
      {/* Logout Dialog */}
      {openLogoutDialog && (
        <LogoutDialog
          isOpen={openLogoutDialog}
          onClose={() => setOpenLogoutDialog(false)}
          onLogout={handleLogout}
        />
      )}

      {openDeleteAccDialog && (
        <DeleteAccountDiallog
          isOpen={openDeleteAccDialog} // Pass down the state to the modal
          onClose={() => setOpenDeleteAccDialog(false)} // Close the modal by updating state
          onDelete={handleDeleteAccount}
        />
      )}
      {openProfileModal && (
        <EditProfileModal
          open={openProfileModal}
          close={() => setOpenProfileModal(false)}
          isEditProfile={true}
          userData={userData}
        />
      )}
    </aside>
  );
};

export default SideNavigation;
