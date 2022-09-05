import React, { useState, Dispatch, SetStateAction } from 'react'
import { trpc } from '../utils/trpc';
import { useRouter } from 'next/router';

const Signin = () => {

    const router = useRouter();

    const [email, setEmail]: [string, Dispatch<SetStateAction<string>>] = useState("");
    const [password, setPassword]: [string, Dispatch<SetStateAction<string>>] = useState("");

    const [status, setStatus]: [string, Dispatch<SetStateAction<string>>] = useState("");

    const signInMutation = trpc.useMutation(["auth.login"], {
        onError(error, variables, context) {
            setStatus(error.message)
        },
    });

    const signin = async(event: React.FormEvent) => {
        event.preventDefault();

        const signInInfo = await signInMutation.mutateAsync({ email: email, password: password});

        const body = {
            email: signInInfo.user.email,
            username: signInInfo.user.username,
            id: signInInfo.user.id,
            admin: signInInfo.user.admin
        }

        const request = await fetch("/api/auth/login", {
            method: "POST",
            body: JSON.stringify(body)
        });

        setStatus(signInInfo.message);

        if(request.ok === true){
            router.push("/");
        }
    }

    return (
        <div className='register-wrapper' >
            <h1>Sign In</h1>

            <form className='form-register' onSubmit={(event) => {
                signin(event)
            }}>
                <div className="input-form">
                    <input type="email" name='email' id='email' placeholder='Email' value={email} onChange={(event) => setEmail(event.target.value)} required />
                    <input type="password" name="password" id="password" placeholder='Password' value={password} onChange={(event) => setPassword(event.target.value)} required />
                </div>
                <button type="submit">Register</button>

                <div className="form-status">
                    {status}
                </div>
            </form>
        </div>
    )
}

export default Signin