import React from 'react'
import Link from 'next/link'

const Header = () => {
  return (
    <div className="header_wrapper">
      <div className="header_component">
        <Link about='home' href="/"><div className="logo">
          <h1></h1>
        </div></Link>
        <div className="links-wrapper">
           <div className="links">
            <div className='link'></div>
            <Link href="/register"><div className="link"></div></Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header