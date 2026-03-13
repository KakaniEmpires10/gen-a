import { getSubUnitById } from "@/action/SubUnitAction";
import FormSubUnit from "@/components/Features/Dashboard/subUnits/form/FormSubUnit";
import { SetPageTitle } from "@/components/Layouts/Dashboard/SetPageTitle";

export default async function Page({ params }: { params: { id: string } }) {
    const subUnit = await getSubUnitById(params.id);

    if (!subUnit) {
        const error = new Error("NOT_FOUND: Sub-unit dengan id (" + params.id + ") tidak ditemukan") as Error & { type: string }
        error.type = "not-found"
        throw error
    }

    return (
        <>
            <SetPageTitle title="Edit Sub-unit" />
            <FormSubUnit data={subUnit} />
        </>
    );
}