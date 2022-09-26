import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useRouter } from "next/router"
import { trpc } from '../../utils/trpc';

const Account = () => {
    const [currentUserAvailable, setCurrentUserAvailable]: [boolean, Dispatch<SetStateAction<boolean>>] =  useState(false)
    const [friendListIds, setFriendListIds]: [string[] | undefined , Dispatch<SetStateAction<string[] | undefined>>] = useState();
    const router = useRouter();
    const { id } = router.query;

    const idString = id as string

    const fetchCurrentUserQuery = trpc.useQuery(["fetch.fetchUserById", { id:  idString}], {
        onSuccess: () => {
            setCurrentUserAvailable(true);
        }
    });

    const fetchFriendList = trpc.useQuery(["fetch.fetchMultiple" , {ids: friendListIds as string[]}]);

    const unfriendUser = trpc.useMutation(["social.unfriend"]);

    const unfirend = async(id: string) => {
        unfriendUser.mutateAsync({user_id: idString, req_user_id: id});        
        fetchFriendList.refetch();
    }

    useEffect(() => {
        const ids = fetchCurrentUserQuery.data?.user?.friends.map(userId => {
            return userId;
        });

        setFriendListIds(ids);
    }, [currentUserAvailable]);

    return (
        <div>
            Account
            <h1>Username</h1>
            {fetchCurrentUserQuery.data?.user?.username}

            <span>friend list</span>
            {fetchFriendList.data?.users.map(user => {
                return (
                    <div key={user.id} >
                        <h1>Username: {user.username}</h1>
                        <button onClick={() => unfirend(user.id)} >Unfriend</button>
                        <button>Report</button>
                    </div>
                )
            })}
        </div>
    )
}

export default Account