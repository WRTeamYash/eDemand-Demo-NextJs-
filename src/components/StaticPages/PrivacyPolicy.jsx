"use client";
import Layout from "../Layout/Layout";
import BreadCrumb from "../ReUseableComponents/BreadCrumb";
import { useSelector } from "react-redux";
import { useState, useEffect } from 'react';
import { useTranslation } from "../Layout/TranslationContext";
import RichTextContent from '../ReUseableComponents/RichTextContent';

const PrivacyPolicy = () => {
  const t = useTranslation();

  const settingsData = useSelector((state) => state.settingsData);
  const privacy_policy = settingsData?.settings?.privacy_policy?.privacy_policy;
  // State to track if the component has mounted (to avoid hydration issues)
  const [isMounted, setIsMounted] = useState(false);

  // Ensure that the component only renders on the client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Don't render anything until after the client-side mount
  }

  return (
    <Layout>
      <BreadCrumb firstEle={t("privacyPolicy")} firstEleLink="/privacy-policy" />
      <section className="contact-us my-12 container mx-auto min-h-[50vh]">
        <RichTextContent content={privacy_policy} />
      </section>
    </Layout>
  );
};

export default PrivacyPolicy;
