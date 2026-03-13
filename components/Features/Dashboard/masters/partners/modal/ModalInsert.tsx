import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { useResponsive } from "@/hooks/use-responsive"
import { propsModalInsert } from "../partners.constant"
import FormPartners from "../form/FormPartners"

const ModalInsert = ({ open, onOpenChange, data }: propsModalInsert) => {
    const { isMobile } = useResponsive();

    const title = data ? "Edit Mitra" : "Tambah Mitra";
    const desc = data ? "Buat Penyesuaian mitra, tekan simpan jika sudah benar" : "Tambah mitra baru, tekan simpan setelah yakin data sudah benar"

    if (!isMobile) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>
                            {desc}
                        </DialogDescription>
                    </DialogHeader>
                    <FormPartners open={open} onOpenChange={onOpenChange} data={data} />
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>{title}</DrawerTitle>
                    <DrawerDescription>
                        {desc}
                    </DrawerDescription>
                </DrawerHeader>
                <FormPartners open={open} onOpenChange={onOpenChange} data={data} />
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="destructive">Batal</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

export default ModalInsert