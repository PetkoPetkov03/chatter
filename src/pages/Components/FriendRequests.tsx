import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import type { User } from '../../types/UserTypes';
import { trpc } from '../../utils/trpc';



interface NotificationProps {
  user: User,
  reqMutation: VoidFunction
}

const FriendRequests = (props: NotificationProps) => {
  const user = props.user;

  const [messageId, setMessageId]: [string | undefined, Dispatch<SetStateAction<string | undefined>>] = useState();
  const [message, setMessage]: [string | undefined, Dispatch<SetStateAction<string | undefined>>] = useState();

  const [friendRequestsIds, setfriendRequestsIds]: [string [], Dispatch<SetStateAction<string[]>>] = useState([""]);
  const {data: fetchNotifIds, isLoading: notifIsLoading, refetch: refetchNotifs} = trpc.useQuery(["social.fetchfriendRequests", {id: user?.id}]);
  const {data: fetchNotifInfo, isLoading: notifIdsIsLoading} = trpc.useQuery(["fetch.fetchMultiple", {ids: friendRequestsIds}]);

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
    setfriendRequestsIds(fetchNotifIds.friendRequests);
  }, [fetchNotifIds]);
  return (
    <div>
      friendRequests
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

export default FriendRequests;