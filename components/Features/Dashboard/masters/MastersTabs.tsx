"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Handshake, Tags } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation"

const MastersNav = [
    {
        icon: Tags,
        href: "/dashboard/masters/tags",
        title: "Tag"
    },
    {
        icon: Building2,
        href: "/dashboard/masters/departments",
        title: "Departemen"
    },
    {
        icon: Handshake,
        href: "/dashboard/masters/partners",
        title: "Mitra"
    },
]

const getTabValue = (path: string) => {
    if (
        path === "/dashboard/masters/departments" ||
        path === "/dashboard/masters/sub-departments"
    ) {
        return "/dashboard/masters/departments";
    }
    return path;
};

const MastersTabs = () => {
    const path = usePathname();
    const tabValue = getTabValue(path);

    return (
        <Tabs value={tabValue} className="items-center">
            <TabsList className="h-auto rounded-none border-b bg-transparent p-0">
                {MastersNav.map(item => (
                    <TabsTrigger key={item.href}
                        value={item.href}
                        className="data-[state=active]:after:bg-primary hover:bg-muted relative flex-col rounded-none px-4 py-2 text-xs after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                        asChild
                    >
                        <Link href={item.href}>
                            <item.icon
                                className="mb-1.5 opacity-60"
                                size={16}
                                aria-hidden="true"
                            />
                            {item.title}
                        </Link>
                    </TabsTrigger>
                ))}
            </TabsList>
        </Tabs>
    )
}

export default MastersTabs