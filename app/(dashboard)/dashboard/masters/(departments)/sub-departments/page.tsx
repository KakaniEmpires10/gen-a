import { columns } from "@/components/Features/Dashboard/masters/departments/tableSubDept/Column"
import { DataTableSubDept } from "@/components/Features/Dashboard/masters/departments/tableSubDept/DataTableSubDept"
import { SetPageTitle } from "@/components/Layouts/Dashboard/SetPageTitle"

const page = () => {
  return (
    <>
      <SetPageTitle title="Manajemen Departemen" />
      <DataTableSubDept columns={columns} />
    </>
  )
}

export default page