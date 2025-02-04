"use client";
import { get_settings, getWebLandingPageApi } from "@/api/apiRoutes";
import { setSettings } from "@/redux/reducers/settingSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../Layout/Footer";
import Loader from "../ReUseableComponents/Loader";
import FAQs from "./FAQs";
import MainLocation from "./MainLocation";
import OurServices from "./OurServices";
import Progress from "./Progress";
import Reviews from "./Reviews";
import { useTheme } from "next-themes";
import { selectTheme } from "@/redux/reducers/themeSlice";
import config from "@/utils/Langconfig";
import { setLanguage } from "@/utils/Helper";
import SomethingWentWrong from "../ReUseableComponents/Error/SomethingWentWrong";

const LandingPage = () => {
  const dispatch = useDispatch();
  
  const currentLanguage = useSelector(
    (state) => state.translation.currentLanguage
  );
  const reduxTheme = useSelector(selectTheme);
  const { theme, setTheme: setNextTheme } = useTheme();

  useEffect(() => {
    setNextTheme(reduxTheme?.theme);
  }, [theme, dispatch]);
  // 
  useEffect(() => {
    document.documentElement.dir = currentLanguage.isRtl ? "rtl" : "ltr";
  }, [currentLanguage.isRtl]);
  // Set default language on component mount
  useEffect(() => {
    dispatch(setLanguage(config.defaultLanguage)); // Set default language
  }, [dispatch]);

  const [landingPageData, setLandingPageData] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Start in a loading state
  const [settingsError, setSettingsError] = useState(false);


  const getLandingPageData = async () => {
    setIsLoading(true);
    try {
      const response = await getWebLandingPageApi();
      setLandingPageData(response.data); // Ensure this matches 'any[]'
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await get_settings();
      dispatch(setSettings(response?.data));
      getLandingPageData();
    } catch (error) {
      console.error("Error fetching settings:", error);
      setSettingsError(true)
    } finally {
      setIsLoading(false); // Ensure loading state is updated after fetching
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if(settingsError){
    return <SomethingWentWrong />
  }

  return (
    <>
      <MainLocation
        landingPageBg={landingPageData?.landing_page_backgroud_image}
        landingPageLogo={landingPageData?.landing_page_logo}
        title={landingPageData?.landing_page_title}
      />
      {landingPageData?.category_section_status === 1 &&
        landingPageData?.categories?.length > 0 && (
          <OurServices
            title={landingPageData?.category_section_title}
            desc={landingPageData?.category_section_description}
            data={landingPageData?.categories}
          />
        )}
      {landingPageData?.rating_section_status === 1 &&
        landingPageData?.ratings?.length > 0 && (
          <Reviews
            title={landingPageData?.rating_section_title}
            desc={landingPageData?.rating_section_description}
            data={landingPageData?.ratings}
          />
        )}
      {landingPageData?.process_flow_status === 1 &&
        landingPageData?.process_flow_data?.length > 0 && (
          <Progress
            title={landingPageData?.process_flow_title}
            desc={landingPageData?.process_flow_description}
            data={landingPageData.process_flow_data}
          />
        )}
      {landingPageData?.faq_section_status === 1 &&
        landingPageData?.faqs?.length > 0 && (
          <FAQs
            title={landingPageData?.faq_section_title}
            desc={landingPageData?.faq_section_description}
            data={landingPageData?.faqs}
          />
        )}
      <Footer />
    </>
  );
};

export default LandingPage;
