import { columns } from "@/components/Features/Dashboard/masters/departments/tableDept/Column"
import { DataTableDept } from "@/components/Features/Dashboard/masters/departments/tableDept/DataTableDept"
import { SetPageTitle } from "@/components/Layouts/Dashboard/SetPageTitle"

const page = () => {
  return (
    <>
      <SetPageTitle title="Manajemen DPH" />
      <DataTableDept columns={columns} />
    </>
  )
}

export default page