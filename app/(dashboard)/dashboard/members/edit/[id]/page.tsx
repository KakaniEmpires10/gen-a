import { getMemberById } from "@/action/MemberAction";
import FormMember from "@/components/Features/Dashboard/members/form/formMember";
import { SetPageTitle } from "@/components/Layouts/Dashboard/SetPageTitle";

export default async function Page({ params }: { params: { id: string } }) {
  const member = await getMemberById(params.id);

  // Untuk not-found, throw custom error
  if (!member) {
    const error = new Error("NOT_FOUND: Member dengan id (" + params.id + ") tidak ditemukan") as Error & { type: string }
    error.type = "not-found"
    throw error
  }

  return (
    <>
      <SetPageTitle title="Edit Member" />
      <FormMember data={member} />
    </>
  );
}