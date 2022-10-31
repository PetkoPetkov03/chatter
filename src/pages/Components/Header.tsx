import { userState } from '../../libs/atoms';
import { useRecoilValue } from 'recoil';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import { IconButton } from '@mui/material';
import Logo from "../../../public/logo.png";
import Link from 'next/link';
import Image from 'next/image';

const Header = () => {

  const user = useRecoilValue(userState);

  return (
    <div className="shadow-lg bg-slate-200/80 shadow-slate-300 flex flex-initial justify-between border-b-2 p-0 mb-4">
      <div className="h-32 w-32">
        <Link about='home' href="/"><Image src={Logo} /></Link>
      </div>
      <div className='flex justify-center p-9 content-center' >
        {user ?
          <>
            <Link href={`/accounts/${user.id}`}><IconButton color="primary" size="large" ><AccountCircleOutlinedIcon color='primary' fontSize="inherit" /></IconButton></Link>
            <Link href="/signout" ><IconButton color='primary' size='large' ><ExitToAppOutlinedIcon color='primary' fontSize='inherit' /></IconButton></Link>
          </>
          :
          <>
            <Link href="/register"><IconButton color='primary' size="large"><VpnKeyOutlinedIcon color='primary' fontSize='inherit' /></IconButton></Link>
            <Link href="/signin" ><IconButton color="primary" size='large' ><LoginOutlinedIcon color='primary' fontSize='inherit' /></IconButton></Link>
          </>}
      </div>
    </div>
  )
}

export default Header