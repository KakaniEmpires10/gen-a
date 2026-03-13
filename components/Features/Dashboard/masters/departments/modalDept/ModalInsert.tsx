import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { useResponsive } from "@/hooks/use-responsive"
import { propsModalInsertDepts } from "../departments.constant"
import FormDepts from "../form/FormDepts"

const ModalInsert = ({ open, onOpenChange, data }: propsModalInsertDepts) => {
    const { isMobile } = useResponsive();

    const title = data ? "Edit Departemen" : "Buat Departemen";
    const desc = data ? "Buat Perubahan pada Departemen disini, tekan simpan jika sudah benar" : "Buat Departemen baru disini, tekan simpan setelah yakin data sudah benar"

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
                    <FormDepts open={open} onOpenChange={onOpenChange} data={data} />
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
                <FormDepts open={open} onOpenChange={onOpenChange} data={data} />
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