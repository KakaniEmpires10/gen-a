"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/ui/password-input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import Kidding from "./Kidding"
import { loginAction } from "@/action/AuthAction"
import { useFormState, useFormStatus } from "react-dom"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className="w-full mt-5" disabled={pending}>
      {pending && <Loader2 className="animate-spin" />}
      {pending ? "Memproses..." : "Masuk"}
    </Button>
  )
}


const FormLogin = () => {
  const [state, formAction] = useFormState(loginAction, null)

  return (
    <form className="flex flex-col gap-4" action={formAction}>
      {state?.error && (
        <Alert 
          variant="soft-destructive"
          key={Date.now()}
          className="animate-shake"
        >
          <AlertCircle className="size-5" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      <div>
        <Label htmlFor="username">Username</Label>
        <Input
          name="username"
          id="username"
          placeholder="Masukkan username anda"
          required
          onInvalid={(e) => e.currentTarget.setCustomValidity("Username harus diisi")}
          onInput={(e) => e.currentTarget.setCustomValidity("")}
        />
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <PasswordInput
          id="password"
          name="password"
          placeholder="Masukkan password anda"
          required
          onInvalid={(e) => e.currentTarget.setCustomValidity("Password harus diisi")}
          onInput={(e) => e.currentTarget.setCustomValidity("")}
        />
      </div>

      <SubmitButton />

      <Kidding />
    </form>
  )
}

export default FormLogin