import {useState, Dispatch, SetStateAction} from "react";
import { userState } from '../../libs/atoms';
import { useRecoilValue } from 'recoil';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import { IconButton } from '@mui/material';
import Logo from "../../../public/logo.png";
import Link from 'next/link';
import Image from 'next/image';
import { trpc } from "../../utils/trpc";
import { FriendRequests, Mentions } from "./Notifications";

const Header = () => {

  const [expandNotificationsState, setExpandNotificationsState]: [boolean, Dispatch<SetStateAction<boolean>>] = useState(false);

  const user = useRecoilValue(userState);

  const {data: notifications, isLoading: isLoadingNotifications, refetch: refetchNotifications} = trpc.useQuery(["fetch.fetchNotifications", user ? {id: user.id} : {id: ""}]);
  const notificationMutation = trpc.useMutation(["fetch.setNotificationsToSeen"]);

  const expandNotifications = (): void => {
    if(expandNotificationsState === false) {
      if(typeof notifications?.notifications !== "undefined") {
        notificationMutation.mutateAsync({notifications: notifications.notifications});
      }
    }
    setExpandNotificationsState(!expandNotificationsState);
  }

  return (
    <div className="shadow-lg bg-slate-200/80 shadow-slate-300 flex flex-initial justify-between border-b-2 p-0 mb-2">
      <div className="h-32 w-32">
        <Link about='home' href="/"><Image src={Logo} alt="unavailable" /></Link>
      </div>
      <div className='flex justify-center p-9 content-center' >
        {user ?
          <>
            <button onClick={expandNotifications}><IconButton color='primary' size="large"><NotificationsActiveOutlinedIcon color="primary" fontSize="inherit" /></IconButton></button>
            {expandNotificationsState ? <Mentions isLoadingNotifications={isLoadingNotifications} notifications={notifications} /> : null}
            {expandNotificationsState ? <FriendRequests id={user.id} /> : null}
            <Link href="/social"><IconButton color='primary' size='large'><ConnectWithoutContactIcon color='primary' fontSize='inherit' /></IconButton></Link>
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