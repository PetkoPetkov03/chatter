import React from 'react';
import type { Notification } from '@prisma/client';
import { trpc } from '../../utils/trpc';

const Notifications = () => {
  return (
    <div>Notifications</div>
  )
}

interface MentionsTypes {
  isLoadingNotifications: boolean,
  notifications: { notifications: Notification[] | undefined; } | undefined
}

export const Mentions = ({ isLoadingNotifications, notifications }: MentionsTypes) => {
  const removeNotificationMutation = trpc.useMutation(["fetch.removeNotification"]);

  const removeMutationHook = async (id: string) => {
    await removeNotificationMutation.mutateAsync({
      id: id
    });
  }
  return (
    <div>
      <h1>Notifications</h1>
      {isLoadingNotifications || typeof notifications === "undefined" ? "Loading...." : notifications?.notifications?.map((notification, i) => {
        return (
          <div key={notification.id}>
            {notification.contend}
            <button onClick={() => removeMutationHook(notification.id)} >X</button>
          </div>
        );
      })}
    </div>
  );
}

type UserId = {
  id: string
}

export const FriendRequests = ({ id }: UserId) => {
  const {data: notifications, refetch: refetchNotifications } = trpc.useQuery(["social.fetchfriendRequests", { id: id }]);
  const {data: friendRequests, isLoading: isLoadingFriendRequests, refetch: refetchFriendRequests} = trpc.useQuery(["fetch.fetchMultiple", {ids: notifications?.friendRequests}]);

  const acceptRequestMutation = trpc.useMutation(["social.acceptFriendRequest"]);
  const ignoreFriendRequestMutation = trpc.useMutation(["social.ignoreFriendRequest"]);


  const refetch = () => {
    refetchNotifications();
    refetchFriendRequests();
  }

  const acceptFriendRequest = async(rid: string): Promise<void> => {
    await acceptRequestMutation.mutateAsync({ curr_user_id:  id, req_user_id: rid});
    refetch();
  }

  const ignoreFriendRequest = async(rid: string): Promise<void> => {
    await ignoreFriendRequestMutation.mutateAsync();
    refetch();
  }

  return(
    <div>
      <h1>Friend Requests: </h1>
      {isLoadingFriendRequests || typeof friendRequests === "undefined" ? "Loading...." : friendRequests.users?.map((request, i) => {
        return (
          <div key={request.id}>
            {request.username}
            <button onClick={() => acceptFriendRequest(request.id)} >Accept friend request</button>
            <button onClick={() => ignoreFriendRequest(request.id)} >Ignore friend request</button>
          </div>
        );
      })}
    </div>
  );
}

export default Notifications