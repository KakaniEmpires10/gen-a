import { DataTableMember } from "@/components/Features/Dashboard/members/table/DataTableMember"
import { columns } from "@/components/Features/Dashboard/members/table/Column"
import { SetPageTitle } from "@/components/Layouts/Dashboard/SetPageTitle"

const page = () => {
  return (
    <>
      <SetPageTitle title="Manajemen Anggota" />
      <DataTableMember columns={columns} />
    </>
  )
}

export default page