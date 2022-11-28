import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { userState } from "../../../libs/atoms"
import { useRouter } from 'next/router';
import type { NextRouter } from "next/router"
import { trpc } from '../../../utils/trpc';
import type { MObject } from '../../../types/UserTypes';

const MessagesComponent = ({ children }: React.PropsWithChildren) => {
    return (
        <div>
            {children}
        </div>
    )
}

const Messages = () => {
    const user = useRecoilValue(userState);
    const [IDS, setIDS] = useState([""]);
    const router: NextRouter = useRouter();

    const { id } = router.query;

    const { data: messages, isLoading: isLoadingMessages }: {  data: MObject | undefined, isLoading: boolean } = trpc.useQuery(["fetch.fetchMessagesAdmin", { sid: IDS[0] as string, rid: IDS[1] as string }]);

    useEffect(() => {
        if (router.isReady) {
            const stringifiedId = id as string;
            const splitId = stringifiedId.split("&");
            setIDS(splitId);
        }

    }, [id])
    return (
        <div>
            {/* <h1>{`${splitId[0]} ${splitId[1]}`}</h1> */}
            <h1>Test</h1>
           {!isLoadingMessages ? null : messages?.submiter.messages.map((message) => {
            return(
                <div key={message.id}>
                    <h1>{message.content}</h1>
                </div>
            )
           })}
        </div>
    )
}

export default Messages