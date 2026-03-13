import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { SectionCards } from "@/components/section-cards"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard"
}

export default function Page() {
  return (
    <>
      <SectionCards />
      <ChartAreaInteractive />
    </>
  )
}
