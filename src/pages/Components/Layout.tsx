import React from 'react'
import Header from './Header'
import Wrapper from './Wrapper'

const Layout = ({ children }: React.PropsWithChildren) => {
  return (
    <div className='h-screen w-full' >
        <Header />
        <Wrapper>
          {children}
        </Wrapper>
    </div>
  )
}

export default Layout