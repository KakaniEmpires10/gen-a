/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoaderCircle, PencilLine, Save } from "lucide-react"
import { Button } from "./button"
import { UseFormReturn } from "react-hook-form"

type SubmitButtonProps<TFormValues extends Record<string, any> = Record<string, any>> = {
    form: UseFormReturn<TFormValues>,
    isUpdate?: boolean
}

const SubmitButton = <TFormValues extends Record<string, any> = Record<string, any>>({
    form,
    isUpdate = false
}: SubmitButtonProps<TFormValues>) => {
    return (
        <Button
            disabled={form.formState.isSubmitting}
            aria-disabled={form.formState.isSubmitting}
            type="submit"
        >
            {form.formState.isSubmitting ? 
                <LoaderCircle className="animate-spin" /> 
                    : ( isUpdate ? <PencilLine /> : <Save />)}
            {form.formState.isSubmitting ? (isUpdate ? "meng-update..." : "Menyimpan...") : (isUpdate ? "Update" : "Simpan")}
        </Button>
    )
}

export default SubmitButton