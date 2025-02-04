"use client";
import { useEffect,useState } from "react";
import dynamic from "next/dynamic";

const Footer = dynamic(() => import("./Footer"), { ssr: false });
const Header = dynamic(() => import("./Header"), { ssr: false });
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { get_settings } from "@/api/apiRoutes";
import { setSettings } from "@/redux/reducers/settingSlice";
import { publicRoutes } from "@/utils/Helper";
import { setIsBrowserSupported } from "@/redux/reducers/locationSlice";
import Loader from "../ReUseableComponents/Loader";
import SomethingWentWrong from "../ReUseableComponents/Error/SomethingWentWrong";

const Layout = ({ children }) => {
  const locationData = useSelector((state) => state?.location);
  const router = useRouter();
  const dispatch = useDispatch();
  const [settingsError, setSettingsError] = useState(false);

  useEffect(() => {
    if ("Notification" in window) {
      if (Notification.permission !== "granted") {
        Notification.requestPermission();
      }
    } else {
      console.log("This browser does not support desktop notifications.");
    }

    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isSafari) {
      dispatch(setIsBrowserSupported(false));
      return;
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          dispatch(setIsBrowserSupported(true));
        },
        (error) => {
          console.error("Geolocation error:", error);
          dispatch(setIsBrowserSupported(true));
        }
      );
    } else {
      console.log("Geolocation not supported");
      dispatch(setIsBrowserSupported(true));
    }
  }, [dispatch]);

  useEffect(() => {
    const currentRoute = router.pathname;
    const isPublicRoute = publicRoutes.includes(currentRoute);
    if (
      !locationData.lat &&
      !locationData.lng &&
      !locationData.locationAddress &&
      !isPublicRoute
    ) {
      router.push("/home");
    }
  }, [locationData]);

  const fetchSettings = async () => {
    try {
      const response = await get_settings();
      dispatch(setSettings(response?.data));
    } catch (error) {
      console.error("Error fetching settings:", error);
      setSettingsError(true); // Set error state to true if API fails
    }
  };


  useEffect(() => {
    fetchSettings();
  }, []);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Show loader on route change start
    const handleStart = () => setLoading(true);
    // Hide loader when route change is complete or fails
    const handleComplete = () => setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    // Cleanup event listeners
    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);


   // If system settings API fails, show the error component
   if (settingsError) {
    return <SomethingWentWrong />;
  }
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Header />
          {children}
          <Footer />
        </>
      )}
    </>
  );
};

export default Layout;
