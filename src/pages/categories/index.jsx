import MetaData from '@/components/Meta/MetaData'
import dynamic from 'next/dynamic'

const AllCaetgoriesPage = dynamic(
  () => import('@/components/PagesComponents/AllCategoriesPage/AllCaetgoriesPage'),
  { ssr: false })

const index = () => {
  return (

    <>
    <MetaData
        title={`Categories - ${process.env.NEXT_PUBLIC_META_TITLE}`}
        description={process.env.NEXT_PUBLIC_META_DESCRIPTION}
        keywords={process.env.NEXT_PUBLIC_META_KEYWORDS}
        pageName="/categories"
      />
    <AllCaetgoriesPage /></>
  )
}

export default index