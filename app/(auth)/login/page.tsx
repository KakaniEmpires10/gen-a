import FormLogin from "@/components/Features/Auth/FormLogin"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Metadata } from "next"

export const metadata: Metadata = {
        title: "Login",
        description: "Login untuk masuk kedalam sistem kami",
}

const LoginPage = () => {
    return (
        <Card className="relative border w-[22rem] sm:w-[28rem] top-14 border-t-4 border-borer border-t-primary">
            <CardHeader>
                <Alert role="div" className="absolute px-10 sm:px-20 py-8 -top-10 left-0 right-0 mx-auto flex flex-col justify-center gap-4 items-center w-[20rem] sm:w-96 shadow shadow-primary">
                    <CardTitle className="font-bold text-xl sm:text-2xl">Login</CardTitle>
                    <AlertDescription className="flex justify-around items-center w-full text-center">
                        Jangan lupa login dulu <br />
                        kejap aja kok
                    </AlertDescription>
                </Alert>
            </CardHeader>
            <CardContent className="mt-24 mb-2">
                <FormLogin />
            </CardContent>
        </Card>
    )
}

export default LoginPage