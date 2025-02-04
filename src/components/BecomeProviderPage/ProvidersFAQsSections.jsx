import React, { useState } from "react";
import FaqAccordion from "../ReUseableComponents/FaqAccordion";
import CommanCenterText from "../ReUseableComponents/CommanCenterText";
import { useTranslation } from "../Layout/TranslationContext";

const ProvidersFAQsSections = ({data}) => {
  const t = useTranslation();

  const [visibleFaqs, setVisibleFaqs] = useState(5); // Initially show 5 FAQs

  const faqs = [
    {
      id: 1,
      question: "Do you provide your own cleaning supplies?",
      answer: "Yes, we provide all the necessary cleaning supplies.",
    },
    {
      id: 2,
      question: "How often should I schedule cleaning services?",
      answer: "We recommend scheduling cleaning services once every two weeks.",
    },
    {
      id: 3,
      question: "What types of cleaning services do you offer?",
      answer: "We offer residential, commercial, and deep cleaning services.",
    },
    {
      id: 4,
      question: "Do you provide your own cleaning supplies?",
      answer: "Yes, we provide all the necessary cleaning supplies.",
    },
    {
      id: 5,
      question: "How often should I schedule cleaning services?",
      answer: "We recommend scheduling cleaning services once every two weeks.",
    },
    {
      id: 6,
      question: "What types of cleaning services do you offer?",
      answer: "We offer residential, commercial, and deep cleaning services.",
    },
    {
      id: 7,
      question: "Do you provide your own cleaning supplies?",
      answer: "Yes, we provide all the necessary cleaning supplies.",
    },
    {
      id: 8,
      question: "How often should I schedule cleaning services?",
      answer: "We recommend scheduling cleaning services once every two weeks.",
    },
    {
      id: 9,
      question: "What types of cleaning services do you offer?",
      answer: "We offer residential, commercial, and deep cleaning services.",
    },
    {
      id: 10,
      question: "Do you provide your own cleaning supplies?",
      answer: "Yes, we provide all the necessary cleaning supplies.",
    },
    {
      id: 11,
      question: "How often should I schedule cleaning services?",
      answer: "We recommend scheduling cleaning services once every two weeks.",
    },
    {
      id: 12,
      question: "What types of cleaning services do you offer?",
      answer: "We offer residential, commercial, and deep cleaning services.",
    },
  ];

  const loadMore = () => {
    setVisibleFaqs((prevVisibleFaqs) => prevVisibleFaqs + 5); // Show 5 more FAQs on each click
  };

  return (
    <section className="provider_faqs card_bg py-8 md:py-20 lg:p-[80px]">
      <div className="container mx-auto">
        <CommanCenterText
          highlightedText={data?.short_headline}
          title={data?.title}
          description={data?.description}
        />
        <div className="faqs_list flex flex-col justify-center gap-5 max-w-3xl mx-auto mt-5">
          {faqs.slice(0, visibleFaqs).map((faq, index) => (
            <div key={index} className="fade-in">
              <FaqAccordion faq={faq} />
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {visibleFaqs < faqs.length && (
          <div className="flex justify-center mt-8">
            <button
              className="px-6 py-2 bg-[#2D2C2F] text-white font-semibold rounded-lg hover:primary_bg_color transition-colors duration-300"
              onClick={loadMore}
            >
              {t("loadMore")}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProvidersFAQsSections;
