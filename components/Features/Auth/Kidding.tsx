import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const Kidding = () => {
    return (
        <Dialog>
            <p className="text-xs text-center">
                Belum Punya akun?
                <DialogTrigger>
                    <span className="font-bold cursor-pointer ml-1 hover:underline">klik disini</span>
                </DialogTrigger>
            </p>
            <DialogContent className="border-l-4 border-l-primary">
                <DialogHeader className="space-y-2">
                    <DialogTitle className="text-xl">
                        Ihh, Beneran Nggak Punya?
                    </DialogTitle>
                    <DialogDescription className="text-sm">
                        Kasian deh <span className="text-xl">&#128569;</span> <br />
                        makanya hubungin admin dulu sana gih...
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default Kidding