import React, { useState, Dispatch, SetStateAction } from 'react'
import { trpc } from '../utils/trpc';
import { useRouter } from 'next/router';

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
        <div className='register-wrapper' >
            <h1>Register</h1>

            {/* eslint-disable-next-line jsx-a11y/role-supports-aria-props */}
            <form aria-disabled={formDisable} className='form-register' onSubmit={(event) => {
                registerUser(event)
            }}>
                <div className="input-form">
                    <input type="email" name='email' id='email' placeholder='Email' value={email} onChange={(event) => setEmail(event.target.value)} required />
                    <input type="text" name="username" id="username" placeholder='Username' value={username} onChange={(event) => setUsername(event.target.value)} required />
                    <input type="password" name="password" id="password" placeholder='Password' value={password} onChange={(event) => setPassword(event.target.value)} required />
                    <input type="password" name="cpassword" id="cpassword" placeholder='Confirm Password' value={cpassword} onChange={(event) => setCpassword(event.target.value)} required />
                </div>
                <input disabled={formDisable} type="submit" value="Register" className='form-btn' />

                <div className="form-status">
                    {status}
                </div>
            </form>
        </div>
    )
}

export default Register