"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";

const DepartmentNav = [
    {
        href: "/dashboard/masters/departments",
        title: "DPH"
    },
    {
        href: "/dashboard/masters/sub-departments",
        title: "Departemen"
    },
]

const DepartmentsTabs = () => {
    const path = usePathname();

    return (
        <Tabs value={path} className="items-center">
            <TabsList>
                {DepartmentNav.map(item => (
                    <TabsTrigger key={item.href} value={item.href} asChild>
                        <Link href={item.href}>
                            {item.title}
                        </Link>
                    </TabsTrigger>
                ))}
            </TabsList>
        </Tabs>
    )
}

export default DepartmentsTabs