import React, { useState, Dispatch, SetStateAction } from 'react'
import { trpc } from '../utils/trpc';
import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';
import { userState } from '../libs/atoms';
import { signinProxie } from '../proxies/signin';
import { createCookieProxie } from '../proxies/cookie';
import Form from './Components/Form';

const Signin = () => {
    const [, setUser] = useRecoilState(userState);


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
        onError(error) {
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
        <Form>

            {/* eslint-disable-next-line jsx-a11y/role-supports-aria-props */}
            <form aria-disabled={formDisable} className='w-full h-full' onSubmit={(event) => {
                signin(event)
            }}>
                <div className="w-full h-full">
                    <div className="flex flex-col justify-center w-full h-full">
                        <h1 className='self-center text-3xl'>Sign In</h1>
                        <div className="flex flex-col w-full h-1/4 p-12">
                            <input className='m-4 border-2 rounded-full border-sky-500' type="email" name='email' id='email' placeholder='Email' value={email} onChange={(event) => setEmail(event.target.value)} required />
                            <input className='m-4 border-2 rounded-full border-sky-500' type="password" name="password" id="password" placeholder='Password' value={password} onChange={(event) => setPassword(event.target.value)} required />
                        </div>

                        <input disabled={formDisable} className="border border-blue-500 m-12 md:border-green-500 bg-gradient-to-r from-green-400 to-yellow-500 hover:from-pink-500 hover:to-yellow-500" type="submit" value="Sign In" /></div>
                    {status.length !== 0 ? <div className="w-full flex justify-center bg-white">
                        <span>{status}</span>
                    </div> : null}
                </div>
            </form>
        </Form>
    )
}

export default Signin