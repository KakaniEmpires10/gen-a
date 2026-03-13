import { columns } from "@/components/Features/Dashboard/masters/partners/table/Column"
import { DataTablePartners } from "@/components/Features/Dashboard/masters/partners/table/DataTablePartners"
import { SetPageTitle } from "@/components/Layouts/Dashboard/SetPageTitle"

const page = () => {
  return (
    <>
      <SetPageTitle title="Manajemen Mitra" />
      <DataTablePartners columns={columns} />
    </>
  )
}

export default page