import React from 'react'
import Link from 'next/link'
import type { User } from '../../types/UserTypes'

const Header = () => {
  return (
    <div className="header_wrapper">
      <div className="header_component">
        <Link about='home' href="/"><div className="logo">
          <h1></h1>
        </div></Link>
        <div className="links-wrapper">
           <div className="links">
            <Link href="/signin" ><div className='link'></div></Link>
            <Link href="/register"><div className="link"></div></Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header