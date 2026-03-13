import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

export const FormHeader = ({ title, isCenter, isColumn }: { title: string, isCenter?: boolean, isColumn?: boolean }) => {
  return (
    <div className={cn(isColumn && "col-span-12")}>
      <h2 className={cn("text-xl font-bold", isCenter && "text-center")}>{title}</h2>
      <Separator className={cn("mt-2 mb-6 w-44 h-0.5 rounded-full bg-primary", isCenter && "mx-auto")} />
    </div>
  )
}