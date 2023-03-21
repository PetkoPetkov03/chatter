import React from 'react';
import { userState } from '../libs/atoms';
import { useRecoilValue } from 'recoil';
import HomeComponent from './Components/HomeComponent';

const Home = () => {
  const user = useRecoilValue(userState);

  return (
    <div className='h-full bg-discordDark'>
      <HomeComponent user={user} />
    </div>
  )
}

export default Home