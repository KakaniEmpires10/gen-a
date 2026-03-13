import { reorderSubUnit } from "@/action/SubUnitAction";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SubUnit } from "@prisma/client";
import { Row } from "@tanstack/react-table"
import { Loader2, PenLine } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";

export const ColOrder = ({ row }: { row: Row<SubUnit> }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const formatRef = useRef<HTMLInputElement>(null)

  const handleChange = async (value: string) => {
    setLoading(true)
    const toastId = toast.loading(`Mengubah Urutan...`)

    const id = row.original.id

    const res = await reorderSubUnit(id, parseInt(value))

    if (!res) {
      toast.error("Terjadi Kesalahan, Coba lagi nanti atau hubungi admin 🙏", { id: toastId })
      setLoading(false)
      return
    }

    if (!res.success) {
      toast.error(res.message, { id: toastId })
      setLoading(false)
      return
    }

    toast.success(res.message, { id: toastId })
    mutate('/api/sub-units')
    
    setLoading(false)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon-sm">{row.getValue("order")}</Button>
      </PopoverTrigger>
      <PopoverContent className="w-[180px]" showArrow>
        <Label className="mb-1.5">Ubah Urutan</Label>
        <div className="flex gap-2">
          <Input className="flex-1" disabled={loading} type="number" ref={formatRef} defaultValue={row.original.order!} />
          <Button
            disabled={loading}
            onClick={() => {
              handleChange(formatRef.current?.value ?? "")
            }}
            size="icon"
          >
            {loading ? <Loader2 className="animate-spin" /> : <PenLine />}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}