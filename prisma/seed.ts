import { Gender, PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const username = process.env.SUPERADMIN_USERNAME;
  const password = process.env.SUPERADMIN_PASSWORD;
  const email = process.env.SUPERADMIN_EMAIL;
  const settingId = process.env.SITE_SETTING_ID;

  if (!username || !password || !email) {
    throw new Error("ENV SUPERADMIN belum lengkap");
  }

  console.log("//=======================================================//");
  console.log("                 Memulai Seed Setting                      ");
  console.log("//=======================================================//");

  await prisma.siteSettings.create({
    data: {
      id: settingId,
      aboutText:
        "Generasi Edukasi Nanggroe Aceh Darussalam (GEN-A) adalah Lembaga Swadaya Masyarakat yang digagas sebagai bentuk kepedulian dan keinginan kuat untuk menjadi Katalisator bagi pembangunan karakter Generasi Unggul Aceh melalui Pengabdian Masyarakat, Pelatihan dan Penelitian",
      address:
        "Jln. Tgk. Lam U No.6, Kota Baru, Kec. Kuta Alam, Kota Banda Aceh, Aceh 23125",
      contactEmail: "acehgenerasi19@gmail.com",
      contactPhone: "085261422127",
      logo: null,
      siteName: "GEN-A",
      orgName: "Generasi Edukasi Nanggroe Aceh",
      tagline:
        "Katalisator generasi unggul yang terkemuka, mandiri, berwawasan global, inovatif, dan aktif dalam mengembangkan evidence-based solution atas permasalahan di masyarakat",
      missionText: [
        "Meningkatkan kepedulian generasi lintas usia dan multidisiplin dalam bersinergi mengoptimalkan kualitas hidup",
        "Menemukan evidance-based solution yang memberikan hasil yang berkelanjutan (sustainable outcome) bagi masalah generasi muda",
        "Menjamin masa tumbuh kembang generasi muda yang bebas dari dampak negatif melalui law enforcement dan kemitraan lintas sektoral",
        "Melakukan pendekatan pemberdayaan masyarakat untuk mengatasi masalah generasi muda",
        "Menjalankan program capacity building untuk mewujudkan generasi unggul",
        "Menjadi role model untuk program pemberdayaan generasi muda (youth empowerment) seluruh Indonesia",
      ],
      visionText: [
        "GEN-A menjadi katalisator generasi unggul yang terkemuka, mandiri, berwawasan global, inovatif, dan aktif dalam mengembangkan evidence-based solution atas permasalahan di masyarakat",
      ],
      socialLinks: [
        {
          nama: "instagram",
          account: "@gen.eduaceh",
          link: "https://instagram.com/gen.eduaceh?igshid=MmU2YjMzNjRlOQ==",
        },
        {
          nama: "facebook",
          account: "@gen.eduaceh",
          link: "https://web.facebook.com/people/geneduaceh/100067062189368/?mibextid=qi2Omg",
        },
        {
          nama: "youtube",
          account: "@Generasi Edukasi Nanggroe Aceh",
          link: "https://www.youtube.com/@generasiedukasinanggroeace3611",
        },
      ],
      updatedAt: new Date(),
    },
  });
  console.log("🚀 SETTING berhasil di-seed");

  console.log("//=======================================================//");
  console.log("                 Memulai Seed Superadmin"                   );
  console.log("//=======================================================//");

  const existingUser = await prisma.users.findUnique({
    where: { username },
  });

  if (existingUser) {
    console.log("✅ SUPERADMIN sudah ada, skip seed");
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.users.create({
    data: {
      username,
      password: hashedPassword,
      role: Role.SUPERADMIN,

      // minimal valid fields
      name: "Super Admin",
      email,
      gender: Gender.MALE,
      image: null,
    },
  });

  console.log("🚀 SUPERADMIN berhasil di-seed");
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
