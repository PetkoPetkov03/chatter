import type { User } from '../../types/UserTypes';
import Image from 'next/image';
import IBG from "../../../public/IBG.jpg";
import Feed from './Feed';

const HomeComponent = ({ user }: {user: User}): JSX.Element => {
  return (
    <div className='flex flex-col bg-discordLighter text-primary h-100% w-screen'>
      <div className='flex justify-center w-screen mt-4 h-full'>
        <Feed user={user} />
      </div>
    </div>
  )
}

export default HomeComponent;