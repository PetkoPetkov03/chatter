import React from 'react';
import { userState } from '../libs/atoms';
import { useRecoilValue } from 'recoil';
import HomeComponent from './Components/HomeComponent';

const Home = () => {
  const user = useRecoilValue(userState);

  return (
      <HomeComponent user={user} />
  )
}

export default Home