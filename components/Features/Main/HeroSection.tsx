import { Button } from "@/components/ui/button"
import Link from "next/link"

const HeroSection = () => {
    return (
        <section className="h-[90vh] relative flex flex-col gap-5 justify-center items-center bg-gradient-to-t from-black/90 via-black/80 text-white p-10 xl:px-96 text-center">
            <h1 className="font-bold text-6xl sm:text-7xl">Generasi Edukasi Nanggroe Aceh</h1>
            <p>Lembaga Swadaya Masyarakat yang digagas sebagai bentuk kepedulian dan keinginan kuat untuk menjadi Katalisator bagi pembangunan karakter Generasi Unggul Aceh</p>
            <div className="flex gap-5">
                <Button asChild size="lg" variant="outline"><Link href="#tentang">Tentang Kami</Link></Button>
                <Button asChild size="lg"><Link href="#kegiatan">Kegiatan Kami</Link></Button>
            </div>
            <video className="absolute w-full h-full object-cover -z-10" src="https://res.cloudinary.com/dhgmt5fsw/video/upload/v1745765750/qo0nrnrw3a3mzilo75wm.webm" autoPlay muted loop />
        </section>
    )
}

export default HeroSection