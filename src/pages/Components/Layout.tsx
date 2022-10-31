import React from 'react'
import Header from './Header'

const Layout = ({ children }: React.PropsWithChildren) => {
  return (
    <div className='h-screen w-full' >
        <Header />
        {children}
    </div>
  )
}

export default Layout