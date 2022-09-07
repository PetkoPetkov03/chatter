import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';
import { userState } from '../libs/atoms';

const Signout = () => {
    const router = useRouter();
    const [_user, setUser] = useRecoilState(userState);
    const logout = async() => {
        await fetch("/api/auth/logout");
        setUser(undefined)
        router.push("/");
    };
    useEffect(() => {
        logout();
    });
}

export default Signout