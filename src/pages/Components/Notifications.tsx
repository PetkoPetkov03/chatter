import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import type { User } from '../../types/UserTypes';
import { trpc } from '../../utils/trpc';



interface NotificationProps {
  user: User,
  reqMutation: VoidFunction
}

const Notifications = (props: NotificationProps) => {
  const user = props.user;

  const [messageId, setMessageId]: [string | undefined, Dispatch<SetStateAction<string | undefined>>] = useState();
  const [message, setMessage]: [string | undefined, Dispatch<SetStateAction<string | undefined>>] = useState();

  const [notificationsIds, setNotificationsIds]: [string [], Dispatch<SetStateAction<string[]>>] = useState([""]);
  const {data: fetchNotifIds, isLoading: notifIsLoading, refetch: refetchNotifs} = trpc.useQuery(["social.fetchNotifications", {id: user?.id}]);
  const {data: fetchNotifInfo, isLoading: notifIdsIsLoading} = trpc.useQuery(["fetch.fetchMultiple", {ids: notificationsIds}]);

  const acceptFriendRequestMutation = trpc.useMutation("social.acceptFriendRequest");

  const acceptFriendRequest = async(id: string) => {
    const request = await acceptFriendRequestMutation.mutateAsync({curr_user_id: user?.id, req_user_id: id});

    setMessageId(request.id);
    setMessage(request.message)
    props.reqMutation();
    refetchNotifs();
  }

  useEffect(() => {
    if(!fetchNotifIds) {
      return;
    }
    setNotificationsIds(fetchNotifIds.notifications);
  }, [fetchNotifIds]);
  return (
    <div>
      Notifications
      {fetchNotifInfo?.users.map(notif => {
        return (
          <div key={notif.id}>
            {notif.username}
            <br />
            <button onClick={() => acceptFriendRequest(notif.id) }>Accept friend request</button>
            {notif.id === messageId ? message : ""}
          </div>
        )
      })}
    </div>
  )
}

export default Notifications