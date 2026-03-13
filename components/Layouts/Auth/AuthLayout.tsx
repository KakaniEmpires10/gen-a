import TopBar from "./TopBar"
import Footer from "./Footer"

const AuthLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
        <div className="flex flex-col min-h-screen mx-8 sm:mx-20 lg:mx-32">
          <TopBar />
            <main className="my-8 flex justify-center">
                {children}
            </main>
          <Footer />  
        </div>
    </>
  )
}

export default AuthLayout