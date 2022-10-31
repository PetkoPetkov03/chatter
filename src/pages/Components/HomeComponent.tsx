import type { User } from '../../types/UserTypes';
import Image from 'next/image';
import IBG from "../../../public/IBG.jpg";

const HomeComponent = ({ user }: {user: User}): JSX.Element => {
  return (
    <div className='h-1/2 w-screen'>
      <Image className='w-screen h-1/2' width="2000vh" height="357vh" src="/IBG.jpg" />
      <div className='w-screen h-full'>
        <h1>Hello World</h1>
      </div>
    </div>
  )
}

export default HomeComponent;