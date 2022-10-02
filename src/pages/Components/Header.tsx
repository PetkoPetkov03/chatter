import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import Link from 'next/link';
import { userState } from '../../libs/atoms';
import { useRecoilValue } from 'recoil';


const Header = () => {

  const user = useRecoilValue(userState);
  
  return (
    <div className="header_wrapper">
      <div className="header_component">
        <Link about='home' href="/"><div className="logo">
          <h1></h1>
        </div></Link>
        <div className="links-wrapper">
          <div className="links">

            {user ?
              <>
                <Link href="/signout" ><div className='link'></div></Link>
                <Link href={`/accounts/${user.id}`}><div className="link"></div></Link>
              </>
              :
              <>
                <Link href="/signin" ><div className='link'></div></Link>
                <Link href="/register"><div className="link"></div></Link>
              </>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header