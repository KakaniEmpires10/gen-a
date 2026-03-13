import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { useResponsive } from "@/hooks/use-responsive"
import { propsModalInsertSubDepts } from "../departments.constant"
import FormSubDepts from "../form/FormSubDepts"

const ModalInsert = ({ open, onOpenChange, data }: propsModalInsertSubDepts) => {
    const { isMobile } = useResponsive();

    const title = data ? "Edit Departemen" : "Buat Departemen";
    const desc = data ? "Buat Perubahan pada departemen disini, tekan simpan jika sudah benar" : "Buat departemen baru disini, tekan simpan setelah yakin data sudah benar"

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
                    <FormSubDepts open={open} onOpenChange={onOpenChange} data={data} />
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
                <FormSubDepts open={open} onOpenChange={onOpenChange} data={data} />
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