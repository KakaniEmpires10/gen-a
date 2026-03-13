"use client"

import { useHeader } from "@/provider/HeaderProvider"

const DashboardTitle = () => {
    const { title } = useHeader()

    return (
        <h1 className="text-base font-bold font-poppins">{title}</h1>
    )
}

export default DashboardTitle