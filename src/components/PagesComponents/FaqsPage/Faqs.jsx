import React, { useEffect, useState } from 'react'
import Layout from '@/components/Layout/Layout'
import BreadCrumb from '@/components/ReUseableComponents/BreadCrumb'
import { getFaqsApi } from '@/api/apiRoutes'
import { useTranslation } from '@/components/Layout/TranslationContext'
import FaqAccordion from '@/components/ReUseableComponents/FaqAccordion'

const Faqs = () => {
    const t = useTranslation()
    const [faqs, setFaqs] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const fetchFaqs = async () => {
        setIsLoading(true)
        const res = await getFaqsApi()
        setFaqs(res?.data)
        setIsLoading(false)
    }

    useEffect(() => {
        fetchFaqs()
    }, [])


    const [visibleFaqs, setVisibleFaqs] = useState(5); // Initially show 5 FAQs


    const loadMore = () => {
        setVisibleFaqs((prevVisibleFaqs) => prevVisibleFaqs + 5); // Show 5 more FAQs on each click
    };


    return (
        <Layout>
            <BreadCrumb firstEle={t("faqs")} firstEleLink="/faqs" />
            <div className="container mx-auto">
                <div className="max-w-7xl mx-auto grid grid-cols-1 gap-4 mb-10">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="w-full flex flex-col gap-4">
                            {/* First column - first half of the sorted data */}
                            {faqs?.slice(0, visibleFaqs).map((faq, index) => (
                                <FaqAccordion faq={faq} key={index} />
                            ))}
                        </div>
                        {visibleFaqs < faqs?.length && (
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
                </div>
            </div>

        </Layout>
    )
}

export default Faqs