import Navbar from '@/components/Layouts/Main/Navbar'
import React from 'react'

const MainLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      <Navbar />
      <main>
        {children}
      </main>
    </>
  )
}

export default MainLayout