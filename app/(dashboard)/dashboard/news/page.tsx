import { columns } from "@/components/Features/Dashboard/news/table/Column"
import { DataTableNews } from "@/components/Features/Dashboard/news/table/DataTableNews"
import { SetPageTitle } from "@/components/Layouts/Dashboard/SetPageTitle"

const NewsPage = () => {
  return (
    <>
      <SetPageTitle title="Manajemen Berita" />
      <DataTableNews columns={columns} />
    </>
  )
}

export default NewsPage