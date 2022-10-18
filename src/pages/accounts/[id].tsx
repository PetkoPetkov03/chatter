import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useRouter } from "next/router"
import { trpc } from '../../utils/trpc';
import type { NextPage } from 'next';
import ReportComponent from '../Components/ReportComponent';
import Upload from '../Components/Upload';

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
            setCurrentUserAvailable(true);
        }
    });

    const {data: fetchMultiple, isLoading: fetchMultipleIsLoading, refetch: fetchMultipleRefetch} = trpc.useQuery(["fetch.fetchMultiple" , {ids: friendListIds as string[]}]);

    const unfriendUser = trpc.useMutation(["social.unfriend"]);

    const unfirend = async(id: string) => {
        unfriendUser.mutateAsync({user_id: idString, req_user_id: id});        
        fetchMultipleRefetch();
    };

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
            {fetchCurrentUser?.user?.username}

            <span>friend list</span>
            {fetchMultiple?.users.map(user => {
                return (
                    <div key={user.id} >
                        <h1>Username: {user.username}</h1>
                        <button onClick={() => unfirend(user.id)} >Unfriend</button>
                        <button onClick={() => reportAssign(user.id)} >Report</button>
                        {reportTrigger && (reportId === user.id) && typeof fetchCurrentUser?.user !== "undefined" && fetchCurrentUser.user ? <ReportComponent User={fetchCurrentUser.user} RepId={reportId} RepTrigger={reportTrigger} SetRepTrigger={setReportTrigger} /> : ""}
                    </div>
                )
            })}
        </div>
    )
}

export default Account