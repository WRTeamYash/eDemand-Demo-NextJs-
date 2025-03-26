"use client";
import CategoryLoop from "./CategoryLoop";
import HighlightTag from "../ReUseableComponents/HighlightTag";
import CustomImageTag from "../ReUseableComponents/CustomImageTag";
import { useTranslation } from "../Layout/TranslationContext";

const ProfessionalServicesSection = ({ data, categoryData }) => {
  const t = useTranslation();

  return (
    <>
      <section className="relative overflow-hidden light_bg_color">
        <div className="pb-0  pt-8 md:pt-20 relative z-10">
          <div className="container mx-auto flex flex-col justify-between items-center lg:flex-row gap-14">
            {/* Left Section: Text */}
            <div className=" text-center lg:text-left flex flex-col">
              <div className="flex items-center justify-center lg:justify-start space-x-2">
                <HighlightTag text={data?.short_headline} />
              </div>
              <span className="text-2xl md:main_headlines mt-[16px] md:mt-[24px] font-bold text_color">
                {data?.title}
              </span>
              <span className="text-sm md:description_text text_color font-normal">
                {data?.description}
              </span>
              {/* <button className="group tag_lines relative px-6 py-3 secondary_bg_color text-white font-medium w-fit mx-auto lg:mx-0  rounded-full transition flex items-center justify-center gap-2 overflow-hidden mt-[16px] md:mt-[24px]">
                <span className="relative z-10">Get Started</span>
                <span className="relative z-10">
                  <BsFillArrowRightCircleFill size={22} />
                </span>

                <div className="absolute inset-0 primary_bg_color transition-transform duration-500 transform translate-y-full group-hover:translate-y-0"></div>
              </button> */}
            </div>

            {/* Right Section: Image and Ratings */}
            <div className="relative w-full flex-shrink-0 lg:w-1/2 flex items-center justify-center">
              {/* Main Service Image */}
              <div className="relative w-full max-w-[500px] h-[400px] md:h-[450px] lg:h-[600px] rounded-t-[150px] md:rounded-t-[200px] lg:rounded-t-[250px] sm:right-50%">
                {/* Background Decoration (Star Shape) */}
                <div className="absolute top-4 -left-4 sm:-left-10 w-24 h-24 lg:w-32 lg:h-32 xl:w-40 xl:h-40 clip-star primary_bg_color opacity-30 dark:bg-[#fff] dark:opacity-100" />

                <div className="relative z-[5] w-full h-full dark:card_bg rounded-t-[150px] md:rounded-t-[200px] lg:rounded-t-[250px]">
                  {data?.images?.map((ele, index) => (
                    <CustomImageTag
                      key={index}
                      src={ele?.image}
                      alt={`service-${index}`}
                      className={`image-slide image-${index} absolute inset-0 w-full h-full object-cover border-r-[2px] pr-2 pt-1 border-t-[1px] rounded-t-[150px] md:rounded-t-[200px] lg:rounded-t-[250px] border_color `}
                    />
                  ))}
                </div>
                {/* Happy Customers Badge */}
                <div className="absolute top-20 -right-4   md:top-24 md:-right-8 bg-white dark:secondary_bg_color border border-[#D8E0E6] rounded-[12px] text-left p-2 md:p-4 z-20">
                  <p className="text-lg md:text-2xl font-bold mb-2">8.5M+</p>
                  <p className="text_color opacity-60 font-medium text-sm md:text-base">
                    {t("happyCustomers")}
                  </p>
                </div>

                {/* Overall Rating Badge */}
                <div className="absolute bottom-12 -left-4 md:-left-10 bg-white dark:secondary_bg_color border border-[#D8E0E6] rounded-[12px] text-left p-4 z-20">
                  <p className="text-lg md:text-2xl font-bold mb-2">4.8 ★</p>
                  <p className="text_color opacity-60 font-medium  text-sm md:text-base">
                    {t("overAllRating")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {categoryData?.length > 0 && (
          <CategoryLoop categoryData={categoryData} />
        )}
      </section>
    </>
  );
};

export default ProfessionalServicesSection;
