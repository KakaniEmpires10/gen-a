"use client"

import { SidebarProvider } from "@/components/ui/sidebar"
import { HeaderProvider } from "./HeaderProvider"
import { SWRConfig } from "swr"
import { fetcher } from "@/lib/utils"

const DashboardProvider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <SWRConfig
        value={{
            fetcher: fetcher,
            revalidateOnFocus: false,
            dedupingInterval: 5000,

            shouldRetryOnError: false,

            onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
                // Stop kalau 4xx
                if (error.status >= 400 && error.status < 500) return

                // Stop kalau network error
                if (error.status === 0) return

                // Maksimal retry 3x
                if (retryCount >= 3) return

                // Retry setelah 3 detik
                setTimeout(() => revalidate({ retryCount }), 3000)
            },
        }}
    >
        <HeaderProvider>
            <SidebarProvider>
                { children }
            </SidebarProvider>
        </HeaderProvider>
    </SWRConfig>
  )
}

export default DashboardProvider