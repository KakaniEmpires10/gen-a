import { DataTableSubUnit } from "@/components/Features/Dashboard/subUnits/table/DataTableSubUnit"
import { columns } from "@/components/Features/Dashboard/subUnits/table/Column"
import { SetPageTitle } from "@/components/Layouts/Dashboard/SetPageTitle"

const page = () => {
  return (
    <>
      <SetPageTitle title="Manajemen Sub-Unit" />
      <DataTableSubUnit columns={columns} />
    </>
  )
}

export default page