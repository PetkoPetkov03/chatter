import React, { useState, Dispatch, SetStateAction } from 'react'
import { trpc } from '../utils/trpc';
import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';
import { userState } from '../libs/atoms';
import { signinProxie } from '../proxies/signin';
import { createCookieProxie } from '../proxies/cookie';

const Signin = () => {
    const [user, setUser] = useRecoilState(userState);


    const fetchUser = async () => {
        const request = await signinProxie();

        const response = await request.json();

        setUser(() => response.user);

    }

    const router = useRouter();

    const [email, setEmail]: [string, Dispatch<SetStateAction<string>>] = useState("");
    const [password, setPassword]: [string, Dispatch<SetStateAction<string>>] = useState("");

    const [status, setStatus]: [string, Dispatch<SetStateAction<string>>] = useState("");

    const [formDisable, setFormDisable]: [boolean, Dispatch<SetStateAction<boolean>>] = useState(false);

    const signInMutation = trpc.useMutation(["auth.login"], {
        onError(error, variables, context) {
            setStatus(error.message)
            setFormDisable(false);
        },
    });

    const signin = async (event: React.FormEvent) => {
        event.preventDefault();

        setFormDisable(true);

        const signInInfo = await signInMutation.mutateAsync({ email: email, password: password });

        const body = {
            email: signInInfo.user.email,
            username: signInInfo.user.username,
            id: signInInfo.user.id,
            admin: signInInfo.user.admin
        }

        const request = await createCookieProxie(body);

        setStatus(signInInfo.message);

        await fetchUser();

        if (request.ok === true) {
            router.push("/");
        }
    }

    return (
        <div className='register-wrapper' >
            <h1>Sign In</h1>

            <form aria-disabled={formDisable} className='form-register' onSubmit={(event) => {
                signin(event)
            }}>
                <div className="input-form">
                    <input type="email" name='email' id='email' placeholder='Email' value={email} onChange={(event) => setEmail(event.target.value)} required />
                    <input type="password" name="password" id="password" placeholder='Password' value={password} onChange={(event) => setPassword(event.target.value)} required />
                </div>
                <input disabled={formDisable} className="form-btn" type="submit" value="Sign In" />

                <div className="form-status">
                    {status}
                </div>
            </form>
        </div>
    )
}

export default Signin