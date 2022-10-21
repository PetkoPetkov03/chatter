import React, { Dispatch, SetStateAction, useState } from 'react'
import { userState } from '../libs/atoms';
import { useRecoilValue } from 'recoil';
import { trpc } from '../utils/trpc';
import Notifications from './Components/Notifications';


const Social = () => {

  const [responseMessage, setResponseMessage]: [string | undefined, Dispatch<SetStateAction<string | undefined>>] = useState();

  const user = useRecoilValue(userState);

  const [searchQuery, setSearhQuery]: [string, Dispatch<SetStateAction<string>>] = useState("");

  const {data: notifications, isLoading: isLoadingNotifications} = trpc.useQuery(["fetch.fetchUser", {username: user?.username}]);

  const {data: search, isLoading: isLoadingSearch, refetch: searchRefetch} = trpc.useQuery(["social.searchEngine", { searchQuery: searchQuery, user: user, current_user_friends: notifications?.users?.friends }]);

  const sendRequestMutation = trpc.useMutation(["social.sendFriendRequest"], {
    onSuccess: () => {
      searchRefetch();
    }
  });
  

  const friendRequest = async(reqUserId: string, currUserId: string): Promise<void> => {
    const request = await sendRequestMutation.mutateAsync({current_user_id: currUserId, requested_user_id: reqUserId});
    const response = {
      id: request.id,
      message: request.message
    }
    setResponseMessage(response.message);
  }

  // TODO integrate notification system show,accept,decline etc.
  return (
    <div>
      Social
      <input type="text" onChange={(e) => setSearhQuery(e.target.value)} />
      <div>
        {search?.searchResults.map((query) => {
          return (
            <div key={query.id} className="queryResult">
              <h1>{query.username}</h1>
              {!user ? "" : <div>
              <button onClick={() => friendRequest(query.id, user.id)} >Send Friend Request!</button>
              {responseMessage}
                </div>}
              
            </div>
          );
        })}
      </div>

      {user ? <Notifications reqMutation={searchRefetch} user={user}/> : ""}
    </div>
  )
}

export default Social