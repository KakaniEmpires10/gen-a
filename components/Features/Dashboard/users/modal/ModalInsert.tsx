import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import FormRegister from "@/components/Features/Auth/FormRegister"
import { propsModals } from "../users.constant";

const ModalInsert = ({ open, onOpenChange }: propsModals) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl w-[600px]">
                <DialogHeader>
                    <DialogTitle>Buat User</DialogTitle>
                    <DialogDescription>
                        Buat user dan member baru disini, tekan simpan setelah yakin data sudah benar
                    </DialogDescription>
                </DialogHeader>
                <FormRegister open={open} onOpenChange={onOpenChange} />
            </DialogContent>
        </Dialog>
    )
}

export default ModalInsert