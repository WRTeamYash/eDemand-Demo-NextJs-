import { useTranslation } from '@/components/Layout/TranslationContext';
import React from 'react';

const NotFoundPage = () => {
  const t = useTranslation()
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center card_bg text-center p-4">
     
      {/* Main Content */}
      <div className="max-w-md space-y-6">
        {/* Illustration */}
        <img
          src="https://via.placeholder.com/300"
          alt="404 Illustration"
          className="w-64 mx-auto"
        />

        {/* Title */}
        <h1 className="text-2xl md:text-6xl font-bold text-gray-800">404</h1>

        {/* Subtitle */}
        <p className="text-base md:text-xl text-gray-600">
         {t("pageNotFoundText")}
        </p>

        {/* Call-to-Action Button */}
        <a
          href="/"
          className="inline-block px-6 py-3 primary_text_color light_bg_color text-white font-semibold rounded-lg transition duration-300"
        >
          {t("goBackHomeHomePage")}
        </a>
      </div>
    </div>
  );
};

export default NotFoundPage;