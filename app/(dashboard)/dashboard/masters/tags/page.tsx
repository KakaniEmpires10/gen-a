import { DataTableTags } from "@/components/Features/Dashboard/masters/tags/table/DataTableTags"
import { columns } from "@/components/Features/Dashboard/masters/tags/table/Column"
import { SetPageTitle } from "@/components/Layouts/Dashboard/SetPageTitle"

const page = () => {
    return (
        <>
            <SetPageTitle title="Manajemen Tags Berita" />
            <DataTableTags columns={columns} />
        </>
    )
}

export default page