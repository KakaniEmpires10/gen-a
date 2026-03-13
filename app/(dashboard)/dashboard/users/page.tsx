import { columns } from "@/components/Features/Dashboard/users/table/Column"
import DataTableUser from "@/components/Features/Dashboard/users/table/DataTableUser"
import { SetPageTitle } from "@/components/Layouts/Dashboard/SetPageTitle"

const UserPage = () => {
  return (
    <>
      <SetPageTitle title="Manajemen User" />
      <DataTableUser columns={columns} />
    </>
  )
}

export default UserPage