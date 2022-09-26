import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { userState } from '../libs/atoms';
import { useRecoilValue } from 'recoil';
import { trpc } from '../utils/trpc';
import Notifications from './Components/Notifications';


const Social = () => {

  type Response = {
    message: string,
    id: string
  } | undefined

  const [response, setResponse]: [Response, Dispatch<SetStateAction<Response>>] = useState();

  const user = useRecoilValue(userState);

  const [searchQuery, setSearhQuery]: [string, Dispatch<SetStateAction<string>>] = useState("");

  const notificationsResults = trpc.useQuery(["fetch.fetchUser", {username: user?.username}]);

  const searchResults = trpc.useQuery(["social.searchEngine", { searchQuery: searchQuery, user: user, current_user_friends: notificationsResults.data?.users?.friends }]);

  const sendRequestMutation = trpc.useMutation(["social.sendFriendRequest"], {
    onSuccess: () => {
      searchResults.refetch();
    }
  });
  

  const friendRequest = async(reqUserId: string, currUserId: string): Promise<void> => {
    const request = await sendRequestMutation.mutateAsync({current_user_id: currUserId, requested_user_id: reqUserId});
    const response = {
      id: request.id,
      message: request.message
    }
    setResponse(response);
  }

  // TODO integrate notification system show,accept,decline etc.
  return (
    <div>
      Social
      <input type="text" onChange={(e) => setSearhQuery(e.target.value)} />
      <div>
        {searchResults.data?.searchResults.map((query) => {
          return (
            <div key={query.id} className="queryResult">
              <h1>{query.username}</h1>
              {!user ? "" : <div>
              <button onClick={() => friendRequest(query.id, user.id)} >Send Friend Request!</button>
              {response && query.id === response.id ? response.message : ""}
                </div>}
              
            </div>
          );
        })}
      </div>

      {user ? <Notifications user={user}/> : ""}
    </div>
  )
}

export default Social