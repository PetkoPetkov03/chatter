import React from 'react';
import { userState } from '../libs/atoms';
import { useRecoilValue } from 'recoil';

const Home = () => {
  const user = useRecoilValue(userState);

  return (
    <div>
      Home
      Hello my dear user {user?.username}
    </div>
  )
}

export default Home