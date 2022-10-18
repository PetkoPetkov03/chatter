import React, { useState, useEffect, SetStateAction, Dispatch } from 'react';
import { useRecoilValue } from 'recoil';
import { User } from '../../types/UserTypes';
import { userState } from '../../libs/atoms';
import { trpc } from '../../utils/trpc';

const AdminPremisions = () => {
    const user: User = useRecoilValue(userState);
    const [authonticated, setAuthonticated]: [boolean, Dispatch<SetStateAction<boolean>>] = useState(false);
    const [authorized, setAuthorized]: [boolean, Dispatch<SetStateAction<boolean>>] = useState(false);
    const [adminPassword, setAdminPassword]: [string, Dispatch<SetStateAction<string>>] = useState("");
    const [message, setMessage]: [string, Dispatch<SetStateAction<string>>] = useState("");
    const [username, setUsername]: [string, Dispatch<SetStateAction<string>>] = useState("");

    const {data: fetchUser, isLoading: fetchUserIsLoading} = trpc.useQuery(['fetch.fetchUser', { username: username }]);

    const getAccessMutation = trpc.useMutation(["admin.access"]);
    const givePriviligesMutation = trpc.useMutation(["admin.givePriviliges"]);

    const queryForAccess = async (): Promise<void> => {
        const response = await getAccessMutation.mutateAsync({
            password: adminPassword
        });

        setAuthorized(response.access);
        setMessage(response.message);
    }

    const givePriviliges = async(id: string, currp: boolean): Promise<void> => {
        const response = await givePriviligesMutation.mutateAsync({id: id, currentPrivilages: currp});

        setMessage(response.message);
    }


    useEffect(() => {
        if (typeof user !== "undefined") {
            setAuthonticated(true);
        }
    }, [user]);

    return (
        <div>
            {!authonticated ?
                <h1>no</h1>
                :
                <div>
                    {!authorized ?
                        <div>
                            <h1>Type Secret Password for access</h1>
                            <input onChange={(e) => setAdminPassword(e.target.value)} type="password" name="password" id="password" />
                            <button onClick={queryForAccess}>Get Access</button>
                        </div>
                        :
                        <div>
                            <h1>Give a user Privilages</h1>
                            <input onChange={(e) => setUsername(e.target.value)} type="text" name="username" id="username" placeholder='username' />
                                <div key={fetchUser?.users?.id} className="div">
                                    <h1>{ fetchUser?.users?.username }</h1>
                                    <button onClick={() => givePriviliges(fetchUser?.users?.id as string, fetchUser?.users?.admin as boolean)} >Give Admin Privilages</button>
                                </div>
                                
                        </div>}
                    {message}
                </div>
            }

        </div>
    )
}

export default AdminPremisions