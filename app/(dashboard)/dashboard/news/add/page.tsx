import { auth } from "@/auth"
import FormNews from "@/components/Features/Dashboard/news/form/FormNews"
import { SetPageTitle } from "@/components/Layouts/Dashboard/SetPageTitle"
import prisma from "@/lib/prisma"

const AddNewsPage = async () => {
  const session = await auth();

  const [tags, partners, subunits, authors] = await Promise.all([
    prisma.tags.findMany(),
    prisma.partners.findMany(),
    prisma.subUnit.findMany({ select: { id: true, name: true, abbreviation: true, logo: true } }),
    prisma.users.findMany({ select: { id: true, name: true, image: true } })
  ])

  return (
    <>
      <SetPageTitle title="Tambah Berita" />
      <FormNews tags={tags} partners={partners} subunits={subunits} authors={authors} session={session} />
    </>
  )
}

export default AddNewsPage