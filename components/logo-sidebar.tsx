import Image from "next/image"
import Link from "next/link"
import { SidebarMenuButton } from "./ui/sidebar"
import { getSiteSettings } from "@/action/SettingAction"

type logoProps = {
    sitedata?: Awaited<ReturnType<typeof getSiteSettings>>;
}

const LogoSidebar = ({ sitedata }: logoProps) => {
    return (
        <SidebarMenuButton
            asChild
            className="data-[slot=sidebar-menu-button]:!p-1.5"
        >
            <Link href="/">
                <Image src={sitedata?.logo ?? "/Logo-GEN-A_mini.png"} width={40} height={50} alt="logo" />
                <span className="font-bold text-lg">{sitedata?.siteName}</span>
            </Link>
        </SidebarMenuButton>
    )
}

export default LogoSidebar