import React, { Dispatch, SetStateAction, useState } from 'react';
import { useRouter } from 'next/router';
import { trpc } from '../../../utils/trpc';

const ChatCreation = () => {
    const router = useRouter();

    
    const [name, setName]: [string,Dispatch<SetStateAction<string>>] = useState("");
    const [message, setMessage]: [string, Dispatch<SetStateAction<string>>] = useState("");

    const { id } = router.query;
    const idString = id as string;
    const [participants, setParticipants]: [string[], Dispatch<SetStateAction<string[]>>] = useState([idString]);
    const fetchFriends = trpc.useQuery(["fetch.fetchFriends", {id: idString}]);
    const {data: chatroomResponse, mutateAsync: createChatRoomAsync} = trpc.useMutation(["chat.createChatRoom"]);

    const addUserToChatroom = (id: string): void => {
        setParticipants([...participants, id]);
    }

    const createChatRoom = async(e: React.FormEvent) => {
        e.preventDefault();
        await createChatRoomAsync({adminId: idString, listOfUsers: participants, name: name});

        setMessage(chatroomResponse?.message as string);
        router.push("/")
    }

    return (
        <div>
            <h1>Create a chatroom</h1>
            {fetchFriends.data?.map((friend) => {
                return (
                    <div key={friend.id} >
                        <h1>{friend.username}</h1>
                        <button onClick={() => addUserToChatroom(friend.id)} disabled={participants?.includes(friend.id) ? true : false}>Add to chatroom</button>
                    </div>
                );
            })}
            <form onSubmit={(e) => createChatRoom(e)} >
                <input type="text" name="name" id="name" onChange={(e) => setName(e.target.value)} />
                <input type="submit" value="Create Chat Room" />
            </form>

            {message}
        </div>
    )
}

export default ChatCreation