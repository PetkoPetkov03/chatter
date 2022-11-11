import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useRouter } from "next/router";
import Link from 'next/link';
import { trpc } from '../../utils/trpc';
import type { NextPage } from 'next';
import ReportComponent from '../Components/ReportComponent';
import Upload from '../Components/Upload';
import Image from 'next/image';

const Account: NextPage = (): JSX.Element => {
    const [globalMessage, setGlobalMessage]: [string | undefined, Dispatch<SetStateAction<string| undefined>>] = useState();
    const [currentUserAvailable, setCurrentUserAvailable]: [boolean, Dispatch<SetStateAction<boolean>>] =  useState(false);
    const [reportId, setReportId]: [string | undefined, Dispatch<SetStateAction<string | undefined>>] = useState();
    const [friendListIds, setFriendListIds]: [string[] | undefined , Dispatch<SetStateAction<string[] | undefined>>] = useState();
    const [reportTrigger, setReportTrigger]: [boolean, Dispatch<SetStateAction<boolean>>] = useState(false);
    const [chatroomMessage, setChatroomMessage]: [string | undefined, Dispatch<SetStateAction<string | undefined>>] = useState();
    const [newAdminId, setNewAdminId]: [string | undefined, Dispatch<SetStateAction<string | undefined>>] = useState();

    const router = useRouter();
    const { id } = router.query;

    const idString = id as string

    const {data: fetchCurrentUser, isLoading: fetchCurrentUserIsLoading} = trpc.useQuery(["fetch.fetchUserById", { id:  idString}], {
        onSuccess: () => {
            setCurrentUserAvailable(true)
        }
    });

    const {data: iconPath, isLoading} = trpc.useQuery(['social.fetchIcon', {id: idString}]);
    const {data: chatrooms, isLoading: isLoadingChatrooms, refetch: chatroomRefetch} = trpc.useQuery(["chat.fetchChatrooms", {id: idString}]);

    const {data: fetchMultiple, isLoading: fetchMultipleIsLoading, refetch: fetchMultipleRefetch} = trpc.useQuery(["fetch.fetchMultiple" , {ids: friendListIds as string[]}]);

    const unfriendUser = trpc.useMutation(["social.unfriend"]);
    const removeChatroomMutation = trpc.useMutation(["chat.deleteChatroom"]);
    const leaveChatroomMutation = trpc.useMutation(["chat.leaveChatroom"]);

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

    const removeChatroom = async(chatroomId: string) => {
        const message = await removeChatroomMutation.mutateAsync({chatroomId: chatroomId, currUserId: idString});
        setChatroomMessage(message.message);
        chatroomRefetch();
    } 

    const leaveTheChatroom = async(chatroomId: string) => {
        const message = await leaveChatroomMutation.mutateAsync({ chatroomId: chatroomId, currentUserId: idString, futureAdminId: typeof newAdminId !== "string" ? null : newAdminId });
        setGlobalMessage(message.message);
        chatroomRefetch();
    }



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
                        <button onClick={() => leaveTheChatroom(chatroom.id)}>Leave Chatroom</button>
                        {chatroom.adminId === idString ? <button onClick={() => removeChatroom(chatroom.id)}>Remove Chatroom</button> : null}
                        {chatroomMessage}
                    </div>
                );
            })}

            <span>friend list</span>
            {fetchMultiple?.users.map(user => {
                return (
                    <div key={user.id} >
                        <h1>Username: {user.username}</h1>
                        {/* FIXME: Fix unfriend solution */}
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