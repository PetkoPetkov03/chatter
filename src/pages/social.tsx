import React from 'react'
import { userState } from '../libs/atoms';
import { selector, useRecoilValue } from 'recoil';


const Social = () => {
  const user = useRecoilValue(userState);
  

  return (
    <div>
      Social
      {user?.username}
    </div>
  )
}

export default Social