"use client"
import { useRouter } from "next/router";
import ProviderDetails from "@/components/Provider/ProviderDetails";
import ProviderServiceDetails from "@/components/Provider/ProviderServiceDetails/ProviderServiceDetails";


const ProviderDetailsPage = () => {

  const router = useRouter();
  const { slug } = router.query;
  
  return (
    <>
      {router.isReady && slug?.length > 1 ? (
        <ProviderServiceDetails />
      ) : (
        <ProviderDetails /> 
      )}
    </>
  );
};

export default ProviderDetailsPage;
