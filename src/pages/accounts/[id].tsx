import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useRouter } from "next/router";
import Link from 'next/link';
import { trpc } from '../../utils/trpc';
import type { NextPage } from 'next';
import ReportComponent from '../Components/ReportComponent';
import Upload from '../Components/Upload';
import Image from 'next/image';

const Account: NextPage = (): JSX.Element => {
    const [currentUserAvailable, setCurrentUserAvailable]: [boolean, Dispatch<SetStateAction<boolean>>] =  useState(false);
    const [reportId, setReportId]: [string | undefined, Dispatch<SetStateAction<string | undefined>>] = useState();
    const [friendListIds, setFriendListIds]: [string[] | undefined , Dispatch<SetStateAction<string[] | undefined>>] = useState();
    const [reportTrigger, setReportTrigger]: [boolean, Dispatch<SetStateAction<boolean>>] = useState(false);
    const router = useRouter();
    const { id } = router.query;

    const idString = id as string

    const {data: fetchCurrentUser, isLoading: fetchCurrentUserIsLoading} = trpc.useQuery(["fetch.fetchUserById", { id:  idString}], {
        onSuccess: () => {
            setCurrentUserAvailable(true)
        }
    });

    const {data: iconPath, isLoading} = trpc.useQuery(['social.fetchIcon', {id: idString}]);
    const {data: chatrooms, isLoading: isLoadingChatrooms} = trpc.useQuery(["chat.fetchChatrooms", {id: idString}]);

    const {data: fetchMultiple, isLoading: fetchMultipleIsLoading, refetch: fetchMultipleRefetch} = trpc.useQuery(["fetch.fetchMultiple" , {ids: friendListIds as string[]}]);

    const unfriendUser = trpc.useMutation(["social.unfriend"]);

    const unfriend = async(id: string) => {
        unfriendUser.mutateAsync({user_id: idString, req_user_id: id});        
        fetchMultipleRefetch();
    };

    const rerouteToChatroom = (id: string) => {
        router.push(`/chatrooms/${id}`);
    }

    const reportAssign = async(id: string) => {
        setReportTrigger(!reportTrigger);
        setReportId(id);
    };



    useEffect(() => {
        const ids = fetchCurrentUser?.user?.friends.map(userId => {
            return userId;
        });
        setFriendListIds(ids);
    }, [currentUserAvailable, fetchCurrentUser?.user?.friends]);

    return (
        <div>
            Account
            <Upload userId={id as string} />
            <h1>Username</h1>
            {!isLoading ? <Image width="200px" height="200px" src={iconPath?.imagePath?.icon as string} /> : ""}
            {fetchCurrentUser?.user?.username}

            <Link href={`/accounts/chatcreation/${idString}`}>Create a chatgroup</Link><br />

            <span>Chatrooms</span><br />
            {chatrooms?.chatrooms.map((chatroom) => {
                return(
                    <div key={chatroom.id} >
                        <h1>{chatroom.name}</h1>
                        <button onClick={() => rerouteToChatroom(chatroom.id)}>Enter chatroom</button>
                    </div>
                );
            })}

            <span>friend list</span>
            {fetchMultiple?.users.map(user => {
                return (
                    <div key={user.id} >
                        <h1>Username: {user.username}</h1>
                        <button onClick={() => unfriend(user.id)} >Unfriend</button>
                        <button onClick={() => reportAssign(user.id)} >Report</button>
                        {reportTrigger && (reportId === user.id) && typeof fetchCurrentUser?.user !== "undefined" && fetchCurrentUser.user ? <ReportComponent User={fetchCurrentUser.user} RepId={reportId} RepTrigger={reportTrigger} SetRepTrigger={setReportTrigger} /> : ""}
                    </div>
                )
            })}
        </div>
    )
}

export default Account