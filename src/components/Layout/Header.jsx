"use client";
import DarkLogo from "@/assets/footer.png";
import LightLogo from "@/assets/header_logo.png";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";
import { getCartApi } from "@/api/apiRoutes";
import {
  clearCart,
  selectTotalItems,
  setCartData,
} from "@/redux/reducers/cartSlice";
import { clearUserData, getUserData } from "@/redux/reducers/userDataSlice";
import {
  isLogin,
  placeholderImage,
  useIsDarkMode,
  useRTL,
} from "@/utils/Helper";
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import CustomImageTag from "../ReUseableComponents/CustomImageTag";
import EditProfileModal from "../auth/EditProfile";
import LoginModal from "../auth/LoginModal";
import TopHeader from "./TopHeader";
import CartDialog from "../ReUseableComponents/Dialogs/CartDialog";
import { usePathname } from "next/navigation";
import AccountDialog from "../ReUseableComponents/Dialogs/AccountDialog";
import { useRouter } from "next/router";
import { useTranslation } from "./TranslationContext";
import { selectReorderMode } from "@/redux/reducers/reorderSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  IoChatboxEllipsesOutline,
  IoExitOutline,
  IoLocationOutline,
  IoCardOutline,
} from "react-icons/io5";
import { CiBookmarkCheck } from "react-icons/ci";
import { FaRegCalendarCheck } from "react-icons/fa";
import { MdNotificationsNone } from "react-icons/md";
import LogoutDialog from "../ReUseableComponents/Dialogs/LogoutDialog";
import FirebaseData from "@/utils/Firebase";

const Header = () => {
  const t = useTranslation();
  const router = useRouter();
  const isRTL = useRTL();
  const pathName = usePathname();
  const dispatch = useDispatch();
  const { signOut } = FirebaseData();
  const userData = useSelector(getUserData);
  const isLoggedIn = isLogin();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoginModalOpen, setLoginModalIsOpen] = useState(false);
  const [cartVisibleDeskTop, setCartVisibleDeskTop] = useState(false);
  const [cartVisibleMobile, setCartVisibleMobile] = useState(false);
  const [accountVisible, setAccountVisible] = useState(false);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [dropdownStates, setDropdownStates] = useState({
    account: false,
  });

  const toggleDropdown = (key) => {
    setDropdownStates((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const isCheckoutPage = pathName === "/checkout";
  const isCartPage = pathName === "/cart";

  // Access total item count using the selector
  const totalItems = useSelector(selectTotalItems);

  const isReorder = useSelector(selectReorderMode);

  const handleOpen = () => {
    setLoginModalIsOpen(true);
    setIsDrawerOpen(false);
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const isDarkMode = useIsDarkMode();

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(clearUserData());
    dispatch(clearCart());
    signOut();
    router.push("/");
  };

  const handleOpenLogoutDialog = (e) => {
    e.preventDefault();
    setOpenLogoutDialog(true);
  };

  // Fetch cart data from API
  const fetchCartDetails = async () => {
    try {
      // Skip cart fetch if we're in a reorder process
      if (isReorder) {
        return;
      }

      const response = await getCartApi();
      if (response?.error === false) {
        const cartData = response.data?.cart_data;

        const structuredCartItems = cartData?.data.map((item) => ({
          ...item,
          ...item.servic_details,
        }));

        dispatch(
          setCartData({
            provider: cartData,
            items: structuredCartItems || [],
          })
        );
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  useEffect(() => {
    if (isLoggedIn && !isReorder) {
      fetchCartDetails();
    }
  }, [isLoggedIn, isReorder]);

  return (
    <header className="w-full sticky top-0 z-50 card_bg dark:bg-gray-900 border-b border-[#21212114]">
      <div>
        {/* Top header */}
        <TopHeader />

        {/* Main header */}
        <div className="py-4 px-4 flex justify-between items-center">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" title={t("home")}>
              <CustomImageTag
                width={0}
                height={0}
                src={!isDarkMode ? LightLogo.src : DarkLogo.src}
                alt="logo"
                className="h-[40px] md:h-[60px] w-full"
                onError={placeholderImage}
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-6 text_color">
              <Link
                href="/"
                className={`relative group text-base font-normal hover:primary_text_color transition-colors ${
                  pathName === "/" ? "primary_text_color" : ""
                }`}
                title={t("home")}
              >
                {t("home")}
                <span
                  className={`absolute left-1/2 -bottom-1  h-0.5 primary_bg_color transition-all duration-300 ease-in-out transform -translate-x-1/2 ${
                    pathName === "/" ? "w-3/4" : "w-0 group-hover:w-3/4"
                  }`}
                ></span>
              </Link>

              <Link
                href="/categories"
                className={`relative group text-base font-normal hover:primary_text_color transition-colors ${
                  pathName === "/categories" ? "primary_text_color" : ""
                }`}
                title={t("categories")}
              >
                {t("categories")}
                <span
                  className={`absolute left-1/2 -bottom-1  h-0.5 primary_bg_color transition-all duration-300 ease-in-out transform -translate-x-1/2 ${
                    pathName === "/categories"
                      ? "w-3/4"
                      : "w-0 group-hover:w-3/4"
                  }`}
                ></span>
              </Link>

              <Link
                href="/providers"
                className={`relative group text-base font-normal hover:primary_text_color transition-colors ${
                  pathName === "/providers" ? "primary_text_color" : ""
                }`}
                title={t("providers")}
              >
                {t("providers")}
                <span
                  className={`absolute left-1/2 -bottom-1  h-0.5 primary_bg_color transition-all duration-300 ease-in-out transform -translate-x-1/2 ${
                    pathName === "/providers"
                      ? "w-3/4"
                      : "w-0 group-hover:w-3/4"
                  }`}
                ></span>
              </Link>

              <Link
                href="/about-us"
                className={`relative group text-base font-normal hover:primary_text_color transition-colors ${
                  pathName === "/about-us" ? "primary_text_color" : ""
                }`}
                title={t("aboutUs")}
              >
                {t("aboutUs")}
                <span
                  className={`absolute left-1/2 -bottom-1  h-0.5 primary_bg_color transition-all duration-300 ease-in-out transform -translate-x-1/2 ${
                    pathName === "/about-us" ? "w-3/4" : "w-0 group-hover:w-3/4"
                  }`}
                ></span>
              </Link>

              <Link
                href="/contact-us"
                className={`relative group text-base font-normal hover:primary_text_color transition-colors ${
                  pathName === "/contact-us" ? "primary_text_color" : ""
                }`}
                title={t("contactUs")}
              >
                {t("contactUs")}
                <span
                  className={`absolute left-1/2 -bottom-1  h-0.5 primary_bg_color transition-all duration-300 ease-in-out transform -translate-x-1/2 ${
                    pathName === "/contact-us"
                      ? "w-3/4"
                      : "w-0 group-hover:w-3/4"
                  }`}
                ></span>
              </Link>
            </nav>

            {isLoggedIn ? (
              <div
                className={`hidden lg:flex items-center space-x-4 ${
                  isRTL ? "space-x-reverse" : ""
                }`}
              >
                {/* Cart Dialog - Single Instance */}
                {!isCheckoutPage && !isCartPage && (
                  <div className="relative">
                    <CartDialog
                      totalItems={totalItems}
                      isVisible={cartVisibleDeskTop}
                      onOpenChange={setCartVisibleDeskTop}
                    />
                  </div>
                )}
                <div className="relative">
                  <AccountDialog
                    userData={userData}
                    handleLogout={handleOpenLogoutDialog}
                    isVisible={accountVisible}
                    onOpenChange={setAccountVisible}
                  />
                </div>
              </div>
            ) : (
              <div className="hidden lg:flex items-center space-x-4">
                <button
                  className="primary_bg_color px-4 py-2 text-white rounded-lg"
                  onClick={handleOpen}
                >
                  {t("login")}
                </button>
              </div>
            )}

            {/* Mobile Navigation Toggle */}
            <div className="lg:hidden flex items-center space-x-4">
              {!isCheckoutPage && !isCartPage && (
                <div className="relative">
                  <CartDialog
                    totalItems={totalItems}
                    isVisible={cartVisibleMobile}
                    onOpenChange={setCartVisibleMobile}
                  />
                </div>
              )}
              <Sheet
                open={isDrawerOpen}
                onOpenChange={setIsDrawerOpen}
                direction="right"
              >
                <SheetTrigger asChild>
                  <button
                    className="description_color dark:text-white"
                    onClick={toggleDrawer}
                  >
                    <FaBars size={24} />
                  </button>
                </SheetTrigger>

                {/* Drawer Content - Opens from Right */}
                <SheetContent className="w-[85%] sm:w-[350px] p-0">
                  <div className="flex flex-col h-full">
                    {/* Logo and Close Button */}
                    <div className="flex items-center justify-between p-4 border-b">
                      <div className="w-32">
                        <CustomImageTag
                          src={isDarkMode ? DarkLogo : LightLogo}
                          alt="Logo"
                          className="w-full h-auto"
                        />
                      </div>
                      <SheetClose asChild>
                        <button className="description_color hover:text-gray-700">
                          <MdClose size={24} />
                        </button>
                      </SheetClose>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex-1 overflow-y-auto">
                      <div className="flex flex-col">
                        <Link
                          href="/"
                          className={`p-4 border-b description_color dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-between ${
                            pathName === "/"
                              ? "light_bg_color !primary_text_color"
                              : ""
                          }`}
                          title={t("home")}
                        >
                          <span>{t("home")}</span>
                          <span className="text-gray-400">›</span>
                        </Link>

                        <Link
                          href="/categories"
                          className={`p-4 border-b description_color dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-between ${
                            pathName === "/categories"
                              ? "light_bg_color !primary_text_color"
                              : ""
                          }`}
                          title={t("categories")}
                        >
                          <span>{t("categories")}</span>
                          <span className="text-gray-400">›</span>
                        </Link>

                        <Link
                          href="/providers"
                          className={`p-4 border-b description_color dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-between ${
                            pathName === "/providers"
                              ? "light_bg_color !primary_text_color"
                              : ""
                          }`}
                          title={t("providers")}
                        >
                          <span>{t("providers")}</span>
                          <span className="text-gray-400">›</span>
                        </Link>

                        <Link
                          href="/about-us"
                          className={`p-4 border-b description_color dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-between ${
                            pathName === "/about-us"
                              ? "light_bg_color !primary_text_color"
                              : ""
                          }`}
                          title={t("aboutUs")}
                        >
                          <span>{t("aboutUs")}</span>
                          <span className="text-gray-400">›</span>
                        </Link>
                        <Link
                          href="/become-provider"
                          className={`p-4 border-b description_color dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-between ${
                            pathName === "/become-provider"
                              ? "light_bg_color !primary_text_color"
                              : ""
                          }`}
                          title={t("becomeProvider")}
                        >
                          <span>{t("becomeProvider")}</span>
                          <span className="text-gray-400">›</span>
                        </Link>

                        <Link
                          href="/contact-us"
                          className={`p-4 border-b description_color dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-between ${
                            pathName === "/contact-us"
                              ? "light_bg_color !primary_text_color"
                              : ""
                          }`}
                          title={t("contactUs")}
                        >
                          <span>{t("contactUs")}</span>
                          <span className="text-gray-400">›</span>
                        </Link>

                        {/* Account Section */}
                        <div className="flex flex-col justify-between h-full">
                          {isLoggedIn ? (
                            <div className="border-b">
                              <button
                                onClick={() => toggleDropdown("account")}
                                className="w-full p-4 description_color dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-between"
                              >
                                <div className="flex items-center space-x-3">
                                  <Avatar className="w-[40px] h-[40px]">
                                    <AvatarImage
                                      src={
                                        userData?.image
                                          ? userData?.image
                                          : placeholderImage
                                      }
                                      alt={userData?.username}
                                    />
                                    <AvatarFallback>
                                      {userData?.username
                                        ?.split(" ")
                                        .map((word) => word[0]?.toUpperCase())
                                        .slice(0, 2)
                                        .join("") || "NA"}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="text-base font-semibold line-clamp-1 text-left">
                                      {userData?.username}
                                    </div>
                                    <div className="text-sm font-normal description_color text-left">
                                      {userData?.email}
                                    </div>
                                  </div>
                                </div>
                                <span
                                  className={`transform transition-transform ${
                                    dropdownStates.account ? "rotate-90" : ""
                                  }`}
                                >
                                  ›
                                </span>
                              </button>
                              {dropdownStates.account && (
                                <div className="bg-gray-50 dark:bg-gray-800">
                                  <Link
                                    href="/general-bookings"
                                    className={`flex items-center gap-4 p-4 pl-8 description_color dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                                      pathName === "/general-bookings"
                                        ? "light_bg_color !primary_text_color"
                                        : ""
                                    }`}
                                  >
                                    <span
                                      className={
                                        pathName === "/general-bookings"
                                          ? "primary_text_color"
                                          : ""
                                      }
                                    >
                                      <FaRegCalendarCheck size={24} />
                                    </span>
                                    <span className="text-base">
                                      {t("bookings")}
                                    </span>
                                  </Link>

                                  <button
                                    onClick={() => router.push("/chats")}
                                    className={`w-full flex items-center gap-4 p-4 pl-8 description_color dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                                      pathName === "/chats"
                                        ? "light_bg_color !primary_text_color"
                                        : ""
                                    }`}
                                  >
                                    <span
                                      className={
                                        pathName === "/chats"
                                          ? "primary_text_color"
                                          : ""
                                      }
                                    >
                                      <IoChatboxEllipsesOutline size={24} />
                                    </span>
                                    <span className="text-base">
                                      {t("chats")}
                                    </span>
                                  </button>

                                  <Link
                                    href="/notifications"
                                    className={`flex items-center gap-4 p-4 pl-8 description_color dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                                      pathName === "/notifications"
                                        ? "light_bg_color  !primary_text_color"
                                        : ""
                                    }`}
                                  >
                                    <span
                                      className={
                                        pathName === "/notifications"
                                          ? "primary_text_color"
                                          : ""
                                      }
                                    >
                                      <MdNotificationsNone size={24} />
                                    </span>
                                    <span className="text-base">
                                      {t("notifications")}
                                    </span>
                                  </Link>

                                  <Link
                                    href="/bookmarks"
                                    className={`flex items-center gap-4 p-4 pl-8 description_color dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                                      pathName === "/bookmarks"
                                        ? "light_bg_color   !primary_text_color"
                                        : ""
                                    }`}
                                  >
                                    <span
                                      className={
                                        pathName === "/bookmarks"
                                          ? "primary_text_color"
                                          : ""
                                      }
                                    >
                                      <CiBookmarkCheck size={24} />
                                    </span>
                                    <span className="text-base">
                                      {t("bookmarks")}
                                    </span>
                                  </Link>

                                  <Link
                                    href="/addresses"
                                    className={`flex items-center gap-4 p-4 pl-8 description_color dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                                      pathName === "/addresses"
                                        ? "light_bg_color !primary_text_color"
                                        : ""
                                    }`}
                                  >
                                    <span
                                      className={
                                        pathName === "/addresses"
                                          ? "primary_text_color"
                                          : ""
                                      }
                                    >
                                      <IoLocationOutline size={24} />
                                    </span>
                                    <span className="text-base">
                                      {t("addresses")}
                                    </span>
                                  </Link>

                                  <Link
                                    href="/payment-history"
                                    className={`flex items-center gap-4 p-4 pl-8 description_color dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                                      pathName === "/payment-history"
                                        ? "light_bg_color !primary_text_color"
                                        : ""
                                    }`}
                                  >
                                    <span
                                      className={
                                        pathName === "/payment-history"
                                          ? "primary_text_color"
                                          : ""
                                      }
                                    >
                                      <IoCardOutline size={24} />
                                    </span>
                                    <span className="text-base">
                                      {t("paymentHistory")}
                                    </span>
                                  </Link>

                                  <button
                                    onClick={handleOpenLogoutDialog}
                                    className="w-full flex items-center gap-4 p-4 pl-8 description_color dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                  >
                                    <span className="primary_text_color">
                                      <IoExitOutline size={24} />
                                    </span>
                                    <span className="text-base">
                                      {t("logout")}
                                    </span>
                                  </button>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="p-4 border-b">
                              <button
                                className="w-full primary_bg_color px-4 py-2 text-white rounded-lg"
                                onClick={handleOpen}
                              >
                                {t("login")}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
      {isLoginModalOpen && (
        <LoginModal
          open={isLoginModalOpen}
          close={() => setLoginModalIsOpen(false)}
          setOpenProfileModal={setOpenProfileModal}
        />
      )}
      {openProfileModal && (
        <EditProfileModal
          open={openProfileModal}
          close={() => setOpenProfileModal(false)}
          isEditProfile={false}
        />
      )}

      {openLogoutDialog && (
        <LogoutDialog
          isOpen={openLogoutDialog}
          onClose={() => setOpenLogoutDialog(false)}
          onLogout={handleLogout}
        />
      )}
    </header>
  );
};

export default Header;
