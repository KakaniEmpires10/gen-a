import { getNewsById } from "@/action/NewsAction"
import { auth } from "@/auth"
import FormNews from "@/components/Features/Dashboard/news/form/FormNews"
import { SetPageTitle } from "@/components/Layouts/Dashboard/SetPageTitle"
import prisma from "@/lib/prisma"

const EditNewsPage = async ({ params }: { params: { id: string } }) => {
  const session = await auth()

  const [news, tags, partners, subunits, authors] = await Promise.all([
    getNewsById(params.id),
    prisma.tags.findMany(),
    prisma.partners.findMany(),
    prisma.subUnit.findMany({ select: { id: true, name: true, abbreviation: true, logo: true } }),
    prisma.users.findMany({ select: { id: true, name: true, image: true } }),
  ])

  // Untuk not-found, throw custom error
  if (!news) {
    const error = new Error("NOT_FOUND: Berita dengan id (" + params.id + ") tidak ditemukan") as Error & { type: string }
    error.type = "not-found"
    throw error
  }

  const initialData = {
    title: news.title,
    slug: news.slug,
    type: news.type,
    status: (news.status === "ARCHIVED" ? "DRAFT" : news.status) as "DRAFT" | "PUBLISHED",
    content: news.content ?? "",
    excerpt: news.excerpt ?? "",
    externalUrl: news.externalUrl ?? "",
    sourceName: news.sourceName ?? "",
    featuredImage: news.featuredImage ?? "",
    authorId: news.authorId,
    subunitId: news.subunitId ?? "",
    publishedAt: new Date(news.publishedAt ?? new Date()),
    tagIds: news.news_tags.map((t) => ({ id: t.tag.id, text: t.tag.name })),
    partnerIds: news.PartnerOnNews.map((p) => ({
      id: p.partners.id,
      text: p.partners.abbreviation,
    })),
  }

  return (
    <>
      <SetPageTitle title="Edit Berita" />
      <FormNews
        newsId={params.id}
        initialData={initialData}
        tags={tags}
        partners={partners}
        subunits={subunits}
        authors={authors}
        session={session}
      />
    </>
  )
}

export default EditNewsPage