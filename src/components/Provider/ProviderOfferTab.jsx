import React, { useEffect, useState } from "react";
import OfferCard from "./OfferCard";
import { getPromoCodeApi } from "@/api/apiRoutes";
import NoDataFound from "../ReUseableComponents/Error/NoDataFound";
import { useTranslation } from "../Layout/TranslationContext";

const ProviderOfferTab = ({ providerId }) => {

  const t = useTranslation();

  const [offers, setOffers] = useState([]);
  const fetchPromoCodes = async () => {
    try {
      const res = await getPromoCodeApi({
        partner_id: providerId,
      });
      if (res?.error === false) {
        setOffers(res?.data);
      } else {
        setOffers([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (providerId) {
      fetchPromoCodes();
    }
  }, [providerId]);
  return (
    <>
      {offers?.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {offers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      ) : (
        <div className="w-full h-[60vh] flex items-center justify-center">
          <NoDataFound
             title={t("noOffers")}
             desc={t("noOffersText")}
          />
        </div>
      )}
    </>
  );
};

export default ProviderOfferTab;
