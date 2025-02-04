import MetaData from '@/components/Meta/MetaData'
import dynamic from 'next/dynamic'

const CategoryDetailsPage = dynamic(
  () => import('@/components/PagesComponents/CategoryDetailsPage/CategoryDetailsPage'),
  { ssr: false })
const index = () => {

  return (
    <>
    <MetaData
        title={`Category Details - ${process.env.NEXT_PUBLIC_META_TITLE}`}
        description={process.env.NEXT_PUBLIC_META_DESCRIPTION}
        keywords={process.env.NEXT_PUBLIC_META_KEYWORDS}
        pageName="/categories/[...slug]"
      />
    <CategoryDetailsPage />
    </>
  )
}

export default index