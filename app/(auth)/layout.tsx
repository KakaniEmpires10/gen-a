import AuthLayout from "@/components/Layouts/Auth/AuthLayout"

const LayoutAuth = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <AuthLayout>
        { children }
    </AuthLayout>
  )
}

export default LayoutAuth