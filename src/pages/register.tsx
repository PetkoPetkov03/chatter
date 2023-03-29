import React, { useState, Dispatch, SetStateAction } from 'react'
import { trpc } from '../utils/trpc';
import { useRouter } from 'next/router';
import Form from './Components/Form';
import BasicButton from './Components/BasicButton';

const Register = () => {
    const router = useRouter();

    const [email, setEmail]: [string, Dispatch<SetStateAction<string>>] = useState("");
    const [username, setUsername]: [string, Dispatch<SetStateAction<string>>] = useState("");
    const [password, setPassword]: [string, Dispatch<SetStateAction<string>>] = useState("");
    const [cpassword, setCpassword]: [string, Dispatch<SetStateAction<string>>] = useState("");

    const [formDisable, setFormDisable]: [boolean, Dispatch<SetStateAction<boolean>>] = useState(false);

    const [status, setStatus]: [string, Dispatch<SetStateAction<string>>] = useState("");

    const registerMutation = trpc.useMutation(["auth.register"], {
        onError(error) {
            setStatus(error.message)
            setFormDisable(false);
        },
        onSuccess() {
            router.push("/");
        },
    });

    const registerUser = async (event: React.FormEvent) => {
        event.preventDefault();
        setFormDisable(true);
        const request = await registerMutation.mutateAsync({ email: email, username: username, password: password, cpassword: cpassword });

        setStatus(request.status);
    }

    return (
        <Form>
            {/* eslint-disable-next-line jsx-a11y/role-supports-aria-props */}
            <form aria-disabled={formDisable} className='w-full h-full' onSubmit={(event) => {
                registerUser(event)
            }}>
                <div className="w-full h-full">
                    <div className="flex flex-col justify-center w-full h-full">
                        <h1 className='self-center text-white text-3xl'>Register</h1>
                        <div className="flex flex-col w-full h-1/4 p-12">
                            <input className='m-1 border-2 rounded-full border-sky-500' type="email" name='email' id='email' placeholder='Email' value={email} onChange={(event) => setEmail(event.target.value)} required />
                            <input className='m-1 border-2 rounded-full border-sky-500' type="text" name="username" id="username" placeholder='Username' value={username} onChange={(event) => setUsername(event.target.value)} required />
                            <input className='m-1 border-2 rounded-full border-sky-500' type="password" name="password" id="password" placeholder='Password' value={password} onChange={(event) => setPassword(event.target.value)} required />
                            <input className='m-1 border-2 rounded-full border-sky-500' type="password" name="cpassword" id="cpassword" placeholder='Confirm Password' value={cpassword} onChange={(event) => setCpassword(event.target.value)} required />
                        </div>

                        <BasicButton disable={formDisable} />
                    </div>
                    {status.length !== 0 ? <div className="w-full flex justify-center bg-white">
                        <span>{status}</span>
                    </div> : null}
                </div>
            </form>
        </Form>
    )
}

export default Register