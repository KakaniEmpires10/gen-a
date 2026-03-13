"use client"

import { useHeader } from "@/provider/HeaderProvider"
import { useEffect } from "react"

export function SetPageTitle({ title }: { title: string }) {
    const { setTitle } = useHeader()

    useEffect(() => {
        setTitle(title)
    }, [title, setTitle])

    return null
}