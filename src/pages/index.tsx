import React, {SetStateAction, Dispatch, useState, useEffect} from 'react';
import { userState } from '../libs/atoms';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { useRouter } from 'next/router';

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