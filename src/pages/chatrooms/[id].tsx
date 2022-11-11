import React, { Dispatch, SetStateAction, useState } from 'react';
import { useRouter } from 'next/router';
import { trpc } from '../../utils/trpc';
import {useRecoilValue} from "recoil";
import {userState} from "../../libs/atoms"
import { User } from '../../types/UserTypes';

function MessagesLoading() {
    return (
        <div>
            loading.....
        </div>
    )
}

function SendMessages(idString: string, user: User, refetchMessages: any) {

    const [message, setMessage]: [string, Dispatch<SetStateAction<string>>] = useState("");
    const {mutateAsync: sendMessageMutation} = trpc.useMutation(["chat.createMessage"]);

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();

        if(user){
            sendMessageMutation({chatroomId: idString, content: message, senderId: user.id, senderName: user.username});
            refetchMessages(true);
            setMessage("");
        }else{
            return;
        }
    }

    return(
        <div>
            <form onSubmit={(e) => sendMessage(e)}>
                <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
                <input type="submit" value="Send Message" />
            </form>
        </div>
    )
}

const Chatrooms = () => {
    const user = useRecoilValue(userState);
    const router = useRouter();
    const { id } = router.query;
    const idString = id as string;

    const { data: messages, isLoading: MessagesLoading, refetch: refetchMessages } = trpc.useQuery(["chat.fetchMessages", { id: idString }], {
        refetchInterval: 50,
    });

    return (
        <div>Chatrooms {id}
            {messages?.messages?.messages.map((message) => {
                return (
                    <div key={message.senderId + Math.random()}>
                        {message.senderName}:
                        {message.content}
                    </div>
                )
            })}
            {SendMessages(idString, user, refetchMessages)}
        </div>
    )
}

export default Chatrooms