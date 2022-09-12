import React, { Dispatch, SetStateAction, useState } from 'react';
import { trpc } from '../utils/trpc';
import { userState } from '../libs/atoms';
import { useRecoilValue } from 'recoil';

const Notifications = () => {
    type Request = {
        id: string,
        username: string
    }
    const [requests, setRequests]: [Request[] | undefined, Dispatch<SetStateAction<Request[] | undefined>>] = useState();
    const user = useRecoilValue(userState);

    const friendRequestsMutation = trpc.useMutation(["social.showFriendRequest"]);
    
    const notificationsQuery = trpc.useQuery(["social.fetchNotif", {user: user}], {
        onSuccess: async(data) => {
            const fetchFriendRequests = await friendRequestsMutation.mutateAsync({ids: data.notifications});

            setRequests(fetchFriendRequests.requests)
        },
    });

    return (
        <div>
            <>
            Notifications
            {requests?.map((request) => {
                return(
                    <>
                        <h1>{request.username}</h1>
                        <p>{request.id}</p>
                    </>
                );
            })}
            </>
        </div>
    )
}

export default Notifications